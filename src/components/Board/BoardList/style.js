import { css } from "@emotion/react";

export const cardLayout = css`
    width: 100%;
    height: 100%;
    overflow-y: scroll;
`;

export const card = css`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    border-radius: 20px;
    height: 500px;
    box-shadow: 0px 3px 5px #00000011;
    background-color: #ffffff;
    cursor: pointer;
`;

export const cardMain = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 10px;
`;

export const cardImg = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 300px;
    border-radius: 20px;
    overflow: hidden;

    & > img {
        width: 100%;
    }
`;

export const cardContent = (isShowImg) => css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 10px;

    & > h3 {
        margin: 0px 0px 4px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    & > div {
        display: -webkit-box;
        overflow: hidden;
        word-break: break-all;
        -webkit-line-clamp: ${isShowImg ? 3 : 11};
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;

        & > * {
            margin: 0px;
            font-size: 16px;
            font-weight: 400;
        }

    }
`;

export const cardFooter = css`
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f5f5f5;
    padding: 0px 20px;
    height: 50px;

        div:nth-of-type(1) {
            display: flex;
            align-items: center;
            font-weight: 600;

        img {
            margin-right: 10px;
            border: 1px solid #dbdbdb;
            border-radius: 50%;
            width: 30px;
            height: 30px;
        }

        span {
            margin-right: 10px;
            font-size: 20px;
            font-weight: 600;
            color: #f2780c;
        }

        p {
            font-size: 20px;
        }
    }

        div:nth-of-type(2) {
            display: flex;
            align-items: center;

            svg {
            width: 30px;
            height: 30px;
            margin-right: 5px;
            fill: #f2780c;
            }

            span {
                font-size: 20px;
                font-weight: 600;
                line-height: 10px;
            }
        }
`;