import { css } from "@emotion/react";

export const layout = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    flex-grow: 1;
    overflow-y: auto;
    background-color: #191919;
`;

export const closeButton = css`
    padding: 10px 10px 0 10px;
    height: 40px;
    background-color: #ffffff;

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        
        svg {
            width: 40px;
            height: 40px;
        }
    }
`;

export const bannerImg = css`
    box-sizing: border-box;
    width: 100%;
    height: 220px;
    padding: 10px;
    background-color: #ffffff;

    img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        object-fit: cover;
    }
`;

export const detailHeader = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    background-color: #ffffff;

    h1 {
        font-size: 36px;
        margin: 0;
    }
`;

export const imgChangeButton = css`
    display: flex;
    justify-content: flex-start;
    padding: 0 10px;
    width: 100%;
    background-color: #ffffff;

    button {
        padding: 0;
        margin-right: 10px;
    }
`;

export const title = css`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    position: relative;

    input {
        padding: 0;
        border: none;
        font-size: 36px;
        font-weight: 600;
        text-align: center;
    }
`;

export const cafeNameInput = css`
    height: 45px;
    border-bottom: 1px solid #ff675b;
`;

export const editButton = css`
    position: absolute;
    right: 10px; 

    svg {
        width: 30px;
        height: 30px;
        fill: #ff675b;
        cursor: pointer;
    }
`;

export const address = css`
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: 600;
`;

export const addressInput = css`
    text-align: center;
    padding: 0;
`;

export const reviewStat = css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    div {
        height: 100%;
        margin-left: 10px;
        font-size: 20px;
    }
`;

export const detailInfo = css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 15px;

    div {
        font-size: 16px;
        font-weight: 500;
    }

    div:nth-of-type(1) {
        color: #ff675b;
    }

    select {
        width: 90px;
        height: 30px;
        text-align: center;
        margin-right: 10px;
        border-radius: 30px;
    }
`;

export const detailContent = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 10px 10px;
    background-color: #ffffff;
`;

export const menuButtons = css`
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-bottom: 1px solid #ff675b;

    button {
        border: 1px solid #000000;
        border-radius: 20px;
        margin-left: 10px;
        padding: 5px 20px;
        font-weight: 600;
    }

    button:nth-of-type(1) {
        margin: 0;
    }
`;

export const activeButton = css`
    background-color: #ff675b;
    color: #111111;
`;