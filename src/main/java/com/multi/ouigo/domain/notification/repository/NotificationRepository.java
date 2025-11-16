package com.multi.ouigo.domain.notification.repository;

import com.multi.ouigo.domain.member.entity.Member;
import com.multi.ouigo.domain.notification.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByReceiverOrderByIdDesc(Member member);
}
