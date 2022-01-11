import React from 'react';
import {FooterContainer, FooterContentContainer, FooterLinkContentContainer} from "./FooterStyles";
import {Link} from 'react-router-dom'

function Footer(props: any) {
    return (
        <FooterContainer>

            <div className="custom-shape-divider-top-1641383310">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                     preserveAspectRatio="none">
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="shape-fill"></path>
                </svg>
            </div>
            <h1>
                DAMOIM
            </h1>
            <FooterContentContainer>
                개발자 : 고병욱 박찬혁

            </FooterContentContainer>
            <FooterLinkContentContainer>
                <Link to={"/"}>
                    소개
                </Link>
                <a href={"#"} onClick={() => window.open('https://jumpy-hornet-f9d.notion.site/DAMOIM-b8b02df07afa4fe99b80456f75b1390d', '_blank')}
                >
                    이용약관
                </a>
                {/*<Link to={"/"}>*/}
                {/*    개인정보 처리방침*/}
                {/*</Link>*/}
                <a href={"#"} onClick={() => window.open('https://open.kakao.com/o/solEdOTd\n', '_blank')}
                >
                    1:1 문의
                </a>
            </FooterLinkContentContainer>
        </FooterContainer>
    );
}

export default Footer;