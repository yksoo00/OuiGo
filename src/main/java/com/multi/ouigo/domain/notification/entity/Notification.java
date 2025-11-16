package com.multi.ouigo.domain.notification.entity;

import com.multi.ouigo.common.entitiy.BaseEntity;
import com.multi.ouigo.domain.member.entity.Member;
import com.multi.ouigo.domain.notification.constant.NotificationType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Where;

@Entity
@NoArgsConstructor
@Getter
@ToString(exclude = "receiver")
@Where(clause = "del_yn = 0")
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cntn")
    private String content;

    @Column(name = "link_url")
    private String url;


    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_no")
    private Member receiver;

    @Builder
    public Notification(Member receiver, NotificationType notificationType, String content,
        String url) {
        this.receiver = receiver;
        this.notificationType = notificationType;
        this.content = content;
        this.url = url;
    }


}
