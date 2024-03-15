import { GithubAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { styled } from "styled-components";
import { auth } from "../firsbase";
import { redirect, useNavigate } from "react-router-dom";

const Button = styled.span`
margin-top: 50px;
background-color: white;
font-weight: 500;
width: 100%;
color: black;
padding: 10px 20px;
border-radius: 50px;
border: 0;
display: flex;
gap: 5px;
align-items: center;
justify-content: center;
cursor: pointer;
`;
const Logo = styled.img`
    height:25px;
`;

export default function GithubButton() {
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            const provider = new GithubAuthProvider();
            //await signInWithRedirect(auth, provider);main two options
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (e) {
            console.error(e)
        }

    }
    return (
        <Button onClick={onClick}>
            <Logo src="/github-logo.svg" />
            Continue with Github
        </Button>
    )
}