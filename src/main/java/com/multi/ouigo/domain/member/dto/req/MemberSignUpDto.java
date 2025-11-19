package com.multi.ouigo.domain.member.dto.req;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberSignUpDto {

    @NotBlank(message = "아이디는 필수 입력 사항입니다")
    @Size(max = 10, message = "아이디는 최대 10자여야 합니다.")
    private String memberId;

    @NotBlank(message = "비밀번호는 필수 입력 사항입니다")
    @Size(max = 18, message = "비밀번호는 최대 18자여야 합니다.")
    private String memberPassword;

    @NotBlank(message = "닉네임는 필수 입력 사항입니다")
    @Size(max = 6, message = "닉네임은 최대 6자여야 합니다.")
    private String memberName;

    @Email(message = "이메일 형식을 유지해야 합니다")
    private String memberEmail;

    @NotNull(message = "나이는 필수 입력 사항입니다.")
    @Min(value = 0, message = "나이는 0세 이상이어야 합니다.")
    @Max(value = 99, message = "나이는 99세 이하이어야 합니다.")
    private Integer memberAge;

    @NotBlank(message = "성별은 필수 입력 사항입니다.")
    @Pattern(regexp = "^[MF]$", message = "성별은 M 또는 F만 입력 가능합니다.")
    private String memberGender;
    @NotBlank(message = "자기소개는 필수 입력 사항입니다")
    @Size(max = 10, message = "자기소개는 최대 50자여야 합니다.")
    private String memberIntro;

}