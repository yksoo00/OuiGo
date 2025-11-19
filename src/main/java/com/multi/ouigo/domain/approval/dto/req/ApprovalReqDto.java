package com.multi.ouigo.domain.approval.dto.req;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApprovalReqDto {

    @NotNull(message = "회원 번호는 필수입니다.")
    private Long memberNo;
    @NotNull(message = "모집 글 아이디는 필수입니다.")
    private Long recruitId;

}
