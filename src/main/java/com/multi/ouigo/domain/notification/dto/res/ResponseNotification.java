package com.multi.ouigo.domain.notification.dto.res;

import com.multi.ouigo.domain.notification.constant.NotificationType;
import com.multi.ouigo.domain.notification.entity.Notification;
import lombok.Data;

@Data
public class ResponseNotification {

    private Long id;
    private String content;
    private String url;
    private NotificationType type;

    public ResponseNotification(Long id, String content, String url,
        NotificationType notificationType) {
        this.id = id;
        this.content = content;
        this.url = url;
        this.type = notificationType;
    }


    public static ResponseNotification from(Notification n) {
        return new ResponseNotification(
            n.getId(),
            n.getContent(),
            n.getUrl(),
            n.getNotificationType()
        );
    }

}
