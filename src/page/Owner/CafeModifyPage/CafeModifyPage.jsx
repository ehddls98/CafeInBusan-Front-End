/** @jsxImportSource @emotion/react */
import * as s from "./style";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCafeDetailQuery } from '../../../apis/CafeApis/getCafeDetailApi';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/firebase";
import { v4 as uuid } from 'uuid';
import { IoCloseOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import StarRating from "../../../apis/util/starRating";
import CafeReview from "../../../components/CafeDetail/CafeReview/CafeReview";
import CafeMenu from "../../../components/CafeDetail/CafeMenu/CafeMenu";
import modifyCafeBannerApi from "../../../apis/CafeApis/modifyCafeBannerApi";
import { useMutation } from "react-query";
import { instance } from "../../../apis/util/instance";

function CafeModifyPage(props) {
    const navigate = useNavigate();
    const params = useParams();
    const cafeId = params.cafeId;
    const inputRef = useRef(null);
    const [selectMenu, setSelectMenu] = useState('review');
    const [viewMode, setViewMode] = useState('user');
    const [imageModify, setImageModify] = useState(false);
    const [modifyImg, setModifyImg] = useState({});
    const [modifyCafeInfo, setModifyCafeInfo] = useState({
        cafeId,
        cafeName: "",
        address: "",
        category: ""
    })

    const { data: cafeDetail, refetch } = useCafeDetailQuery(cafeId);

    useEffect(() => {
        if (cafeDetail) {
            setModifyImg(img => ({
                ...img,
                img: cafeDetail?.img
            }));
        }
    }, [cafeDetail])

    useEffect(() => {
        if (cafeDetail) {
            setModifyCafeInfo(({
                cafeId,
                cafeName: cafeDetail.cafeName,
                address: cafeDetail.address,
                category: cafeDetail.category
            }));
        }
    }, [cafeDetail])

    const saveCafeInfoMutation = useMutation(
        async () => {
            return await instance.put(`/cafe/${cafeId}`, modifyCafeInfo);
        },
        {
            onSuccess: () => {
                alert("카페 정보 수정 완료");
                refetch();
                setViewMode('user');
            },
            onError: () => {
                alert("카페 정보 수정 실패");
                setModifyCafeInfo(({
                    cafeName: cafeDetail.cafeName,
                    address: cafeDetail.address,
                    category: cafeDetail.category
                }));
            }
        }
    );

    const handleMenuOnClick = (e) => {
        setSelectMenu(e.target.value);
    }

    const handleEditButtonOnClick = () => {
        if (viewMode === 'user') {
            setViewMode('owner');
            return;
        }
        setViewMode('user');
    }

    const handleImageChangeClick = () => {
        inputRef.current.click(); // 파일 선택창 열기
        console.log(inputRef.current);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file === undefined) {
            setImageModify(modifyImg.img !== cafeDetail?.img ? true : false);
            setModifyImg(img => ({
                ...img,
                img: modifyImg.img
            }));
            return;
        }
        console.log(file);
        const storageRef = ref(storage, `cafe/banner/${cafeDetail?.cafeName}/${uuid()}_${cafeDetail?.cafeName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            () => { },
            () => { },
            async (success) => {
                try {
                    console.log("check");
                    const url = await getDownloadURL(storageRef)
                    setModifyImg(img => ({
                        ...img,
                        img: url
                    }));
                    setImageModify(true);
                } catch (error) {
                    console.error("다운로드 에러");
                }
            }
        );
    }

    const handleConfirmOnClick = async () => {
        const response = await modifyCafeBannerApi(cafeId, modifyImg.img);
        if (response.status === 200) {
            setImageModify(false);
            alert("이미지 변경 성공");
        }
    }

    const handleProfileImageCancel = useCallback(() => {
        setImageModify(false);
        setModifyImg((imgs) => ({
            ...imgs,
            img: cafeDetail?.img
        }))
    }, [])

    const handleTitleInputOnChange = (e) => {
        setModifyCafeInfo(prevInfo => ({
            ...prevInfo,
            [e.target.name]: e.target.value
        }))
    }

    const handleAddressInputOnChange = (e) => {
        setModifyCafeInfo(prevInfo => ({
            ...prevInfo,
            [e.target.name]: e.target.value
        }))
    }

    const handleCategoryChange = (e) => {
        setModifyCafeInfo(prevInfo => ({
            ...prevInfo,
            category: e.target.value
        }))
    }

    const handleSaveOnClick = async () => {
        console.log(modifyCafeInfo);
        saveCafeInfoMutation.mutateAsync();
    }

    const handleCancelOnClick = () => {
        setModifyCafeInfo(({
            cafeId,
            cafeName: cafeDetail.cafeName,
            address: cafeDetail.address,
            category: cafeDetail.category
        }));
        setViewMode('user');
    }

    return (
        <div css={s.layout}>
            {
                viewMode === 'user'
                    ?
                    <div css={s.closeButton}>
                        <button onClick={() => navigate(-1)}><IoCloseOutline /></button>
                    </div>
                    :
                    <div css={s.closeButton}></div>
            }
            <div css={s.bannerImg}>
                <img src={modifyImg.img} alt="배너 이미지" />
            </div>
            <div css={s.imgChangeButton}>
                <button onClick={handleImageChangeClick}>이미지 변경</button>
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    style={{ display: 'none' }} // 숨겨진 input
                    onChange={handleImageChange}
                />
                {
                    imageModify === true ?
                        <div>
                            <button onClick={handleConfirmOnClick}>확인</button>
                            <button onClick={handleProfileImageCancel}>취소</button>
                        </div>
                        : <></>
                }
            </div>
            <div css={s.detailHeader}>
                <div css={s.title}>
                    {
                        viewMode === 'user'
                            ?
                            <>
                                <div>
                                    <h1>{cafeDetail?.cafeName}</h1>
                                </div>
                                <div css={s.editButton}>
                                    <button onClick={handleEditButtonOnClick}><FaRegEdit /></button>
                                </div>
                            </>
                            :
                            viewMode === 'owner'
                                ?
                                <>
                                    <div css={s.cafeNameInput}>
                                        <input type="text"
                                            name="cafeName"
                                            value={modifyCafeInfo.cafeName}
                                            onChange={handleTitleInputOnChange}
                                        />
                                    </div>
                                    <div css={s.editButton}>
                                        <button onClick={handleSaveOnClick}>저장</button>
                                        <button onClick={handleCancelOnClick}>취소</button>
                                    </div>
                                </>
                                :
                                <></>
                    }
                </div>
                {
                    viewMode === 'user'
                        ?
                        <div>{cafeDetail?.address}</div>
                        :
                        viewMode === 'owner'
                            ?
                            <input css={s.addressInput}
                                name="address"
                                value={modifyCafeInfo?.address}
                                onChange={handleAddressInputOnChange}
                            />
                            :
                            <></>
                }
                <div css={s.reviewStat}>
                    <StarRating averageRating={cafeDetail?.totalRating} />
                    <div>{cafeDetail?.totalRating}</div>
                </div>
                <div css={s.detailInfo}>
                    {
                        viewMode === 'user'
                            ?
                            <div>{cafeDetail?.category}</div>
                            :
                            viewMode === 'owner'
                                ?
                                <select value={modifyCafeInfo.category} onChange={handleCategoryChange}>
                                    <option value="베이커리">베이커리</option>
                                    <option value="디저트">디저트</option>
                                    <option value="분위기">분위기</option>
                                    <option value="브런치">브런치</option>
                                </select>
                                :
                                <></>
                    }
                    <div>리뷰 {cafeDetail?.reviewCount}</div>
                </div>
            </div>
            <div css={s.detailContent}>
                <div css={s.menuButtons}>
                    <button
                        css={selectMenu === 'menu' ? s.activeButton : null}
                        onClick={handleMenuOnClick}
                        value={"menu"}>
                        Menu
                    </button>
                    <button
                        css={selectMenu === 'review' ? s.activeButton : null}
                        onClick={handleMenuOnClick}
                        value={"review"}>
                        Review
                    </button>
                </div>
                {
                    selectMenu === 'review'
                        ? <CafeReview cafeDetail={cafeDetail} />
                        : <CafeMenu />
                }
            </div>
        </div>
    );
}

export default CafeModifyPage;