import { styled } from "styled-components"
import { ColorRing } from 'react-loader-spinner'


const Wrapper = styled.div`
    height: 100vh;
    display:flex;
    justify-content:center;
    align-items:center;
`;


export default function LoadingScreen() {
    return <Wrapper><ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        colors={['#0F5257', '#0B3142', '#9C92A3', '#C6B9CD', '#D6D3F0']} /></Wrapper>
}