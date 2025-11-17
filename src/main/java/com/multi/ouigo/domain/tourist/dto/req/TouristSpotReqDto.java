package com.multi.ouigo.domain.tourist.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class TouristSpotReqDto {


    private Long id;  // 수정 시 필요, 등록 시에는 null 가능

    @NotBlank(message = "지역명은 필수입니다.")
    @Size(max = 255, message = "지역명은 255자 이하로 적어주세요.")
    private String district;

    @NotBlank(message = "관광지명은 필수입니다.")
    @Size(max = 255, message = "관광지명은 255자 이하로 적어주세요.")
    private String title;

    @NotBlank(message = "관광지 설명은 필수입니다.")
    @Size(max = 1000, message = "관광지설명은 255자 이하로 적어주세요.")
    private String description;

    @NotBlank(message = "관광지 주소는 필수입니다.")
    @Size(max = 255, message = "관광지 주소는 255자 이하로 적어주세요.")
    private String address;

    @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$",
            message = "전화번호 형식이 올바르지 않습니다. (예: 02-123-4567)")
    @NotBlank(message = "관광지 전화번호는 필수입니다.")
    private String phone;



}


//그건 **데이터 유효성 검사(Validation)**를 위한 어노테이션입니다.
//
//클라이언트(브라우저나 앱)가 서버로 데이터를 보낼 때, name 필드가 **"제대로 된 값"**인지 자동으로 검사해주는 역할을 합니다.
//
//🧐 @NotBlank의 정확한 역할
//@NotBlank는 해당 문자열(String) 필드가 다음 세 가지 경우를 모두 허용하지 않도록 막아줍니다.
//
//        null (값이 아예 없음)
//
//        "" (빈 문자열)
//
//        " " (공백 문자만 있는 문자열)
//
//즉, **"최소 한 개 이상의 공백이 아닌 문자가 포함되어야 한다"**는 것을 강제합니다.
//
//❓ message = "상품명은 필수입니다."의 역할
//만약 클라이언트가 name 값을 비우거나( "" ) 공백만( " " ) 보내서 유효성 검사에 실패하면, 서버는 이 message에 적힌 "상품명은 필수입니다."라는 문자열을 에러 응답에 담아 클라이언트에게 자동으로 보내줍니다.
//
