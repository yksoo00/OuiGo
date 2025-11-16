package com.multi.ouigo.domain.notification.controller;

import com.multi.ouigo.common.response.ResponseDto;
import com.multi.ouigo.domain.notification.dto.res.ResponseNotification;
import com.multi.ouigo.domain.notification.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * SSE 실시간 연결
     */
    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> subscribe(
        @RequestParam(name = "token") String accessToken,
        @RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId) {
        return ResponseEntity.ok(
            notificationService.subscribe(accessToken, lastEventId));
    }

    /**
     * 알림 리스트 조회
     */
    @GetMapping
    public ResponseEntity<ResponseDto> getMyNotifications(HttpServletRequest request) {
        List<ResponseNotification> result = notificationService.findNotification(request);
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK, "알림 조회 성공", result));
    }

    /**
     * 알림 단건 읽음 처리
     */
    @DeleteMapping("/{notificationId}/read")
    public ResponseEntity<ResponseDto> readOne(
        @PathVariable Long notificationId, HttpServletRequest request) {

        notificationService.readOne(notificationId, request);
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK, "읽음 처리 완료", null));
    }

    /**
     * 전체 읽음 처리
     */
    @PostMapping("/read-all")
    public ResponseEntity<ResponseDto> readAll(HttpServletRequest request) {
        notificationService.readAll(request);
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK, "전체 읽음 처리 완료", null));
    }
    
}