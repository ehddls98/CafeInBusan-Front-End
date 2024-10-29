import React, { useCallback, useEffect, useRef, useState } from 'react';
/** @jsxImportSource @emotion/react */
import * as s from "./style";
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import { instance } from '../../../apis/util/instance';
import ReactModal from 'react-modal';
import { State } from '../../../atom/userState';
import ModifyProfilePage from '../../MyPage/ModifyProfilePage/ModifyProfilePage';
import UserProfileModify from '../../MyPage/UserProfileModify/UserProfileModify';
import PostModify from '../../MyPage/PostModify/PostModify';
import CommentState from '../../MyPage/CommentState/CommentState';
import ReviewState from '../../MyPage/ReviewState/ReviewState';
import AlramInfoPage from '../../MyPage/AlramInfo/AlramInfo';
import { RiAlarmWarningLine, RiAlarmWarningFill } from "react-icons/ri";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { PiCoffee } from "react-icons/pi";
import { VscMegaphone } from "react-icons/vsc";


function OwnerMyPage(props) {
    const navigate = useNavigate();
    const [alram, setAlram] = useState(false);
    const [user, setUser] = useRecoilState(State);
    const [check, setCheck] = useState("user");
    const [isCount, setCount] = useState({
        user: {},
        board: {},
        review: {},
        comment: {}
    })
    const [isOpen, setIsOpen] = useState();

    const openModal = () => {
        setIsOpen(true)
        console.log(isOpen);
    };

    const closeModal = () => {
        setIsOpen(false)
        console.log(isOpen);
    };

    // const startTimer = useCallback(() => {
    //     const timer = setInterval(() => {
    //         setAlram(prevAlram => !prevAlram);
    //     }, 1000);

    //     return () => clearInterval(timer)
    // }, [alram])

    // useEffect(() => {
    //     const clearTimer = startTimer();
    //     return clearTimer;
    // }, [startTimer]);

    const userManagement = useQuery(
        ["userManagementInfo"],
        async () => {
            const response = instance.get(`/user/auth/info`);
            return response;
        },
        {
            retry: 0,
            enabled: !user?.username,
            onSuccess: response => {
                setUser(response.data);
                setCount(response.data);
                console.log(user);
            },
            onError: response => {
                alert(`${response.data?.user?.username} 의 정보를 가져오지 못했습니다.`);
            }
        }
    );

    const handleOnModalClick = (value) => {
        if (value) {
            console.log("e" + value);
            setCheck(value);
            setIsOpen(true);
        }
        console.log(check);
    };

    const handleCafeManageOnClick = async () => {
        const userId = userManagement?.data?.data?.user.id;
        if (userId) {
            try {
                const response = await instance.get(`/cafe/user`);
                navigate(`/owner/cafe/modify/${response?.data}`);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div css={s.layout}>
            <div css={s.profileBox}>
                <ModifyProfilePage
                    handleOnModalClick={() => handleOnModalClick("userinfo")}
                    setIsOpen={setIsOpen}
                    value={"userinfo"}
                    closeModal={closeModal}
                    isOpen={isOpen}
                />
            </div>
            <div css={s.menuContainer}>
                <div css={s.menu} onClick={() => handleOnModalClick("post")}>
                    <div css={s.menuName}>
                        <BsFillFileEarmarkPostFill />
                        <p>게시글 관리</p>
                    </div>
                    <p>{isCount.board.length === 0 ? '0' : isCount.board.length}</p>
                </div>
                <div css={s.menu} onClick={() => handleOnModalClick("comment")}>
                    <div css={s.menuName}>
                        <FaRegCommentDots />
                        <p>댓글 관리</p>
                    </div>
                    <p>{isCount.comment.length === 0 ? '0' : isCount.comment.length}
                    </p>
                </div>
                <div css={s.menu} onClick={() => handleOnModalClick("review")}>
                    <div css={s.menuName}>
                        <MdOutlineRateReview />
                        <p>리뷰 관리</p>
                    </div>
                    <p>{isCount.review.length === 0 ? '0' : isCount.review.length}</p>
                </div>
                <div css={s.menu} onClick={handleCafeManageOnClick}>
                    <div css={s.menuName}>
                        <PiCoffee />
                        <p>카페 관리</p>
                    </div>
                </div>
                <div css={s.menu} onClick={() => handleOnModalClick("review")}>
                    <div css={s.menuName}>
                        <VscMegaphone />
                        <p>공지사항</p>
                    </div>
                </div>
                <div css={s.menu} onClick={() => handleOnModalClick("alram")}>
                    <div css={s.menuName}>
                        <RiAlarmWarningFill />
                        <p>알림 정보</p>
                    </div>
                </div>
            </div>
            <ReactModal isOpen={isOpen} check={check} isCount={isCount[check]} style={s.modalStyles}>
                <button onClick={closeModal}>Close</button>
                {
                    check === "userinfo" ?
                        <UserProfileModify isCount={isCount.user} />
                        :
                        check === "post" ?
                            <PostModify isCount={isCount.board} />
                            :
                            check === "comment" ?
                                <CommentState comment={isCount.comment} />
                                :
                                check === "review" ?
                                    <ReviewState isCount={isCount.review} />
                                    :
                                    check === "alram" ?
                                        <AlramInfoPage isCount={isCount} />
                                        : <></>
                }
            </ReactModal>
        </div>
    );
}

export default OwnerMyPage;