package com.multi.ouigo.domain.notification.service;

import com.multi.ouigo.common.exception.custom.NotAuthorizedException;
import com.multi.ouigo.common.exception.custom.NotFindException;
import com.multi.ouigo.common.jwt.provider.TokenProvider;
import com.multi.ouigo.common.response.ResponseDto;
import com.multi.ouigo.domain.member.entity.Member;
import com.multi.ouigo.domain.member.repository.MemberRepository;
import com.multi.ouigo.domain.notification.constant.NotificationType;
import com.multi.ouigo.domain.notification.dto.res.ResponseNotification;
import com.multi.ouigo.domain.notification.entity.Notification;
import com.multi.ouigo.domain.notification.repository.EmitterRepository;
import com.multi.ouigo.domain.notification.repository.NotificationRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final EmitterRepository emitterRepository;
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;
    private final TokenProvider tokenProvider;
    //연결 지속시간 한시간
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;


    public SseEmitter subscribe(String token, String lastEventId) {
        String jwt = tokenProvider.resolveToken(token);
        Long mNo = tokenProvider.getMemberNo(jwt);
        String memberNo = String.valueOf(mNo);

        System.out.println("memberNo = " + memberNo);
        String emitterId = memberNo + "_" + System.currentTimeMillis();
        SseEmitter emitter = emitterRepository.save(emitterId, new SseEmitter(DEFAULT_TIMEOUT));

        //시간 초과나 비동기 요청이 안되면 자동으로 삭제
        emitter.onCompletion(() -> emitterRepository.deleteById(emitterId));
        emitter.onTimeout(() -> emitterRepository.deleteById(emitterId));

        //최초 연결시 더미데이터가 없으면 503 오류가 발생하기 때문에 해당 더미 데이터 생성
        sendToClient(
            emitter,
            emitterId,
            new ResponseDto(HttpStatus.OK, "CONNECTED", null)
        );

        //lastEventId 있다는것은 연결이 종료됬다. 그래서 해당 데이터가 남아있는지 살펴보고 있다면 남은 데이터를 전송
        if (!lastEventId.isEmpty()) {
            Map<String, Object> events = emitterRepository.findAllEventCacheStartWithByMemberId(
                String.valueOf(memberNo));
            events.entrySet().stream()
                .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                .forEach(entry -> sendToClient(emitter, entry.getKey(), entry.getValue()));
        }
        return emitter;

    }


    public void send(Member receiver, NotificationType notificationType, String content,
        String url) {
        Notification notification = saveNotification(receiver, notificationType, content, url);
        String memberId = String.valueOf(receiver.getNo());

        Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithByMemberId(
            memberId);
        sseEmitters.forEach(
            (key, emitter) -> {
                emitterRepository.saveEventCache(key, notification);
                sendToClient(emitter, key, new ResponseDto(HttpStatus.OK, "새로운 알림",
                    ResponseNotification.from(notification)));
            }
        );
    }

    @Transactional
    private Notification createNotification(Member receiver, NotificationType notificationType,
        String content, String url) {
        return Notification.builder().receiver(receiver).notificationType(notificationType)
            .content(content).url(url).build();
    }

    private void sendToClient(SseEmitter emitter, String emitterId, Object data) {
        try {
            emitter.send(SseEmitter.event()
                .id(emitterId)
                .data(data));
        } catch (IOException exception) {
            emitterRepository.deleteById(emitterId);
        }
    }


    /**
     * 알림 조회
     */
    public List<ResponseNotification> findNotification(HttpServletRequest request) {

        String memberId = tokenProvider.extractMemberId(request);

        Member member = memberRepository.findByMemberId(memberId)
            .orElseThrow(() -> new NotFindException("없는 멤버입니다."));

        List<Notification> list =
            notificationRepository.findAllByReceiverOrderByIdDesc(member);

        return list.stream()
            .map(ResponseNotification::from)
            .toList();
    }

    /**
     * 읽음 처리
     */
    @Transactional
    public void readOne(Long notificationId, HttpServletRequest request) {
        String memberId = tokenProvider.extractMemberId(request);

        Notification n = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new NotFindException("알림을 찾을 수 없습니다"));

        n.setDeleted(true);
    }

    /**
     * 전체 읽음 처리
     */
    @Transactional
    public void readAll(HttpServletRequest request) {
        String memberId = tokenProvider.extractMemberId(request);

        Member member = memberRepository.findByMemberId(memberId)
            .orElseThrow(() -> new NotFindException("없는 멤버입니다"));

        List<Notification> list = notificationRepository.findAllByReceiverOrderByIdDesc(member);
        list.forEach(n -> n.setDeleted(true));
    }

    /**
     * 삭제
     */
    @Transactional
    public void deleteOne(Long id, HttpServletRequest request) {
        String memberId = tokenProvider.extractMemberId(request);

        Notification n = notificationRepository.findById(id)
            .orElseThrow(() -> new NotFindException("알림을 찾을 수 없습니다"));

        if (!n.getReceiver().getNo().toString().equals(memberId)) {
            throw new NotAuthorizedException("본인의 알림만 삭제할 수 있습니다");
        }

        n.setDeleted(true);
    }

    /**
     * 알림 저장 전용 트랜잭션
     */
    @Transactional
    public Notification saveNotification(Member receiver, NotificationType type, String content,
        String url) {
        Notification noti = Notification.builder()
            .receiver(receiver)
            .notificationType(type)
            .content(content)
            .url(url)
            .build();

        return notificationRepository.save(noti);
    }
}