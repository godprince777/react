import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import { Link } from "react-router-dom";

/**
 * 회원가입 또는 로그인 폼을 보여주는 컴포넌트 
 */

const AuthFormBlock = styled.div`
    h3 {
        margin: 0;
        color: ${palette.gray[8]};
        margin-bottom: 2rem;
        font-size: 1.8rem;
        font-weight: 700;
        text-align: center;
        background: linear-gradient(135deg, ${palette.cyan[6]}, ${palette.blue[6]});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
`;

/**
 *  스타일링 된 인풋
 */
const StyledInput = styled.input`
    font-size: 1rem;
    border: 2px solid ${palette.gray[3]};
    border-radius: 12px;
    padding: 1rem 1.2rem;
    outline: none;
    width: 100%;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    box-sizing: border-box;
    
    &::placeholder {
        color: ${palette.gray[5]};
        font-weight: 300;
    }
    
    &:focus {
        border-color: ${palette.cyan[5]};
        background: white;
        box-shadow: 0 0 0 3px rgba(59, 201, 219, 0.1);
        transform: translateY(-2px);
    }
    
    &:hover {
        border-color: ${palette.gray[4]};
        background: white;
    }
    
    & + & {
       margin-top: 1.2rem;
    }
`;

const Footer = styled.div`
    margin-top: 2rem;
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid ${palette.gray[3]};
    
    a {
        color: ${palette.cyan[6]};
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
            color: ${palette.cyan[7]};
            background: rgba(59, 201, 219, 0.1);
            transform: translateY(-1px);
        }
    }
`;

const ButtonWithMarginTop = styled(Button)`
    margin-top: 1rem;
`;

const textMap = {
    login: '로그인',
    register: '회원가입',
};

const ErrorMessage = styled.div`
    color: #fff;
    background: linear-gradient(90deg, #ff5858 0%, #f09819 100%);
    border-radius: 8px;
    border: 1.5px solid #ff5858;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1.2rem;
    padding: 0.8rem 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(255,88,88,0.08);
    gap: 0.5rem;
    animation: shake 0.25s linear 1;

    &::before {
        content: '⚠️';
        font-size: 1.2rem;
        margin-right: 0.5rem;
    }

    @keyframes shake {
        0% { transform: translateX(0); }
        20% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
        100% { transform: translateX(0); }
    }
`;

const AuthForm = ({ type, form, onChange, onSubmit, error }) => {
    const text = textMap[type];
    return (
        <AuthFormBlock>
            <h3>{text}</h3>
            <form onSubmit={onSubmit}>
                <StyledInput autoComplete="username" name="username" placeholder="아이디" onChange={onChange} value={form.username} />
                <StyledInput autoComplete="new-password" name="password" placeholder="비밀번호" type="password" onChange={onChange} value={form.password} />
                {type === 'register' && (
                    <StyledInput autoComplete="new-password" name="passwordConfirm" placeholder="비밀번호 확인" type="password" onChange={onChange} value={form.passwordConfirm}/>
                )}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <ButtonWithMarginTop 
                $cyan 
                $fullWidth 
                $style={{ marginTop: '1rem' }}>
                    {text}
                </ButtonWithMarginTop>
            </form>
            <Footer>
                {type === 'login' ? (
                    <Link to="/register">회원가입</Link>
                ) : (
                    <Link to="/login">로그인</Link>
                )}
            </Footer>    
        </AuthFormBlock>
    );
};

export default AuthForm;