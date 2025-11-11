package com.multi.ouigo.domain.trip.repository;


import com.multi.ouigo.domain.trip.entity.TripCard;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripCardRepository {

    //특정 회원의 여행 카드 조회

    Optional<TripCard> findByMemberNo(Long memberNo);

}