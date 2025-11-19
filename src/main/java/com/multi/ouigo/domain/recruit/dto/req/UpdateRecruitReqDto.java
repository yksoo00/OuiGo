package com.multi.ouigo.domain.recruit.dto.req;

import com.multi.ouigo.domain.condition.constant.AgeCode;
import com.multi.ouigo.domain.condition.constant.GenderCode;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateRecruitReqDto {

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 100, message = "제목은 최대 100글자까지 가능합니다.")
    private String recruitTitle;

    @NotBlank(message = "내용은 필수입니다.")
    @Size(max = 1000, message = "내용은 최대 1000글자까지 가능합니다.")
    private String recruitContent;

    @NotNull(message = "시작일은 필수입니다.")
    @PastOrPresent(message = "시작일은 과거 또는 오늘만 가능합니다.")
    private LocalDate startDate;

    @NotNull(message = "종료일은 필수입니다.")
    @FutureOrPresent(message = "종료일은 오늘 또는 미래여야 합니다.")
    private LocalDate endDate;

    @NotNull(message = "카테고리는 필수입니다.")
    private String recruitCategory;
    @NotEmpty(message = "성별 코드는 최소 1개 이상 선택해야 합니다.")
    private List<GenderCode> genderCodes;

    @NotEmpty(message = "나이대 코드는 최소 1개 이상 선택해야 합니다.")
    private List<AgeCode> ageCodes;

    @NotNull(message = "관광지 아이디는 필수입니다.")
    private Long touristSpotId;
}
