package com.multi.ouigo.domain.approval.repository;

import com.multi.ouigo.domain.approval.entity.Approval;
import com.multi.ouigo.domain.member.entity.Member;
import com.multi.ouigo.domain.recruit.entity.Recruit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {

    boolean existsByRecruitAndMember(Recruit recruit, Member member);
}
