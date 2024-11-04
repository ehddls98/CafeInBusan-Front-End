import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */
import * as s from "./style";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleInputOnChange } from '../../../apis/util/handleInputOnChange/handleInputOnChange';
import { showFieldErrorMessage } from '../../../apis/util/showFieldErrorMessage/showFieldErrorMessage';
import { oAuth2SignupApi } from '../../../apis/signUpApis/oauth2SignupApi';
import emailApi from '../../../apis/emailApis/emailApi';
import SignupDuplicateCheckValue from '../../../apis/EmptyDuplicateCheckValue/SignupDuplicateCheckValue';
import useCheckInputValueApi from '../../../apis/useCheckInputValueApi/useCheckInputValueApi';

function OAuth2Signup(props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isCheckUsername, setCheckUsername] = useState(false);
    const [isTimerStopped, setIsTimerStopped] = useState();
    const [emailCheckState, setEmailCheckState] = useState(false);
    const [emailCheck, setEmailCheck] = useState("");
    const [emailNumber, setEmailNumber] = useState("");
    const [complete, setComplete] = useState(false);
    const { duplicatedCheckValue, errorData } = useCheckInputValueApi();
    const [inputUser, setInputUser] = useState({
        username: '',
        password: '',
        checkPassword: '',
        email: '',
        name: '',
        nickname: '',
        phoneNumber: '',
        role: "USER",
    })

    const handleInputEmailCheck = (e) => {
        const { name, value } = e.target;
        if (name === 'emailCheck' && !/^\d*$/.test(value)) {
            alert("숫자만 입력가능합니다")
            return; // 숫자가 아닌 입력은 무시 
        }
        setEmailCheck(value);
    }

    const [fieldErrorMessages, setFieldErrorMessages] = useState({
        username: <></>,
        password: <></>,
        checkPassword: <></>,
        name: <></>,
        email: <></>,
        nickname: <></>,
        phoneNumber: <></>,
        oauth2Name: <></>
    });

    const handleMergepageOnClick = async () => {
        console.log(inputUser);
        console.log(searchParams.get("oAuth2Name"));
        console.log(searchParams.get("provider"));
        if (inputUser.password !== '' && inputUser.checkPassword !== '') {
            if (inputUser.password !== inputUser.checkPassword) {
                alert("비밀번호가 일치하지 않습니다")
                return;
            }
        }
        const mergeData = {
            username: inputUser.username,
            password: inputUser.password,
            email: inputUser.email,
            name: inputUser.name,
            nickname: inputUser.nickname,
            phoneNumber: inputUser.phoneNumber,
            oauth2Name: searchParams.get("oAuth2Name"),
            provider: searchParams.get("provider"),
            role: 'USER'
        }
        console.log(mergeData);
        const response = await oAuth2SignupApi(mergeData);
        console.log(response);
        if (!response.isSuccess) {
            if (response.errorStatus === "loginError") {
                alert(response.error);
                return;
            }
            if (response.errorStatus === "fieldError") {
                console.log(response.errorStatus);
                const newErrors = showFieldErrorMessage(response.error);
                setFieldErrorMessages(newErrors);
                return;
            }
        }
        if (response.isSuccess) {
            alert("통합 완료");
            navigate("/oauth/oauth2");
            console.log(mergeData);
        }
    }

    const handleOnEmailCheckClick = async () => {
        console.log("이메일 넘버" + emailNumber);
        console.log("이메일 체크" + emailCheck);
        if (emailCheck !== '') {
            if (emailNumber == emailCheck) {
                alert("인증성공");
                setTimer(0);
                setEmailCheckState(false);
                setIsTimerStopped(true);
                setIsTimerRunning(false);
            }
            if (emailNumber != emailCheck) {
                alert("인증번호가 일치하지 않습니다.");
            }
        }
    }

    const startTimer = async (email) => {
        try {
            if (email.trim() === '') {
                alert('빈 값은 입력할 수 없습니다.');
                return;
            }
            setIsTimerStopped(false);
            setEmailCheckState(true);
            setIsTimerRunning(true);
            setTimer(180);
            const response = await emailApi(email);
            const verificationCode = response.number;
            setEmailNumber(verificationCode);

        } catch (error) {
            console.error("Error occurred:", error);
            alert("이메일 인증 요청 중 오류가 발생했습니다.");
        }
    }

    const handleCheckUser = (e) => {
        const { name } = e.target;
        console.log(inputUser[name]);
        if (name === 'password' || name === 'checkPassword') {
            if (inputUser.password && inputUser.checkPassword) {
                if (inputUser.password !== inputUser.checkPassword) {
                    alert("비밀번호와 확인번호 다시 확인해주세요.")
                    return;
                }
            } else {
                alert("빈 값입니다.");
                return
            }
        }
        if (SignupDuplicateCheckValue(inputUser[name])) {
            return;
        }
        duplicatedCheckValue(name, inputUser[name])
    }

    return (
        <div css={s.layout}>
            <div css={s.Info}>
                <div css={s.logo}>
                    <h1>
                        통합 회원가입
                    </h1>
                </div>
                <div>
                    <div css={s.Inputvalue}>
                        <input type="text" name='username' value={inputUser.username} onChange={handleInputOnChange(setInputUser)} placeholder='아이디' style={{ color: isCheckUsername ? '#adadad' : '#ffffff' }} />
                        <button name='username' onClick={handleCheckUser}>중복 확인</button>
                    </div>
                    {fieldErrorMessages.username}
                </div>
                <div>
                    <input type="password" name='password' value={inputUser.password} onChange={handleInputOnChange(setInputUser)} placeholder='비밀번호' />
                </div>
                {fieldErrorMessages.password}
                <div>
                    <input type="password" name='checkPassword' value={inputUser.checkPassword} onChange={handleInputOnChange(setInputUser)} placeholder='비밀번호 확인' />
                    {fieldErrorMessages.checkPassword}
                    {fieldErrorMessages.passwordMatching}
                </div>
                <div>
                    <input type="text" name='name' value={inputUser.name} onChange={handleInputOnChange(setInputUser)} placeholder='이름' />
                </div>
                {fieldErrorMessages.name}
                <div css={s.emailCheck}>
                    <input type="email" name='email' value={inputUser.email} onChange={handleInputOnChange(setInputUser)} placeholder='이메일' disabled={emailCheckState} />
                    <button name='email' onClick={() => startTimer(inputUser.email)}>이메일 인증</button>
                </div>
                {fieldErrorMessages.email}
                <div css={s.emailButton}>
                    <div>
                        <div css={s.emailcert}>
                            <div css={s.emailTimer}>
                                <input type="text" name='emailCheck' value={emailCheck} onChange={handleInputEmailCheck} readOnly={!emailCheckState} />
                                <div>
                                    {isTimerRunning && <p>남은 시간: {Math.floor(timer / 60)}분 {timer % 60}초</p>}
                                </div>
                            </div>
                            <div css={s.emailCheckButton}>
                                {
                                    !emailCheckState ?
                                        <></>
                                        :
                                        <button onClick={() => startTimer(inputUser.email)}>재요청</button>
                                }
                                <button onClick={handleOnEmailCheckClick}>확인</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div css={s.Inputvalue}>
                        <input type="text" name='nickname' value={inputUser.nickname} onChange={handleInputOnChange(setInputUser)} placeholder='닉네임' />
                        <button name='nickname' onClick={handleCheckUser}>중복 확인</button>
                    </div>
                </div>
                {fieldErrorMessages.nickname}
                <div>
                    <input
                        type="text"
                        name='phoneNumber'
                        value={inputUser.phoneNumber}
                        onChange={handleInputOnChange(setInputUser)} placeholder='전화번호' />
                    {fieldErrorMessages.phoneNumber}
                </div>
                <div css={s.signupbutton}>
                    <button
                        onClick={handleMergepageOnClick}
                        disabled={complete}>가입하기</button>
                </div>
            </div>
        </div>
    );
}

export default OAuth2Signup;