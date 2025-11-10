package com.multi.ouigo.domain.tourist.entity;


import com.multi.ouigo.common.entitiy.BaseEntity;
import com.multi.ouigo.domain.tourist.dto.req.TouristSpotReqDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "touristspots")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TouristSpot extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "dstc", nullable = false)
    private String district;
    @Column(name = "ttl", nullable = false)
    private String title;
    @Column(name = "dsc", nullable = false, length = 5000)
    private String description;
    @Column(name = "addr", nullable = false)
    private String address;
    @Column(name = "phn", nullable = false)
    private String phone;

    public void update(@Valid TouristSpotReqDto touristSpotReqDto) {
        this.district = touristSpotReqDto.getDistrict();
        this.title = touristSpotReqDto.getTitle();
        this.description = touristSpotReqDto.getDescription();
        this.address = touristSpotReqDto.getAddress();
        this.phone = touristSpotReqDto.getPhone();
    }
}
