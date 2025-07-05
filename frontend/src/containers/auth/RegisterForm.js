import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, register } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from "../../modules/user";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const dispatch = useDispatch();
    const form = useSelector(state => state.auth.register);
    const auth = useSelector(state => state.auth.auth);
    const authError = useSelector(state => state.auth.authError);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    // 인풋 변경 이벤트 핸들러
    const onChange = e => {
        const { value, name } = e.target;
        dispatch(changeField('register', name, value));
    };
    // 폼 등록 이벤트 핸들러
    const onSubmit = e => {
        e.preventDefault();
        const { username, password, passwordConfirm } = form;
        if (password !== passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        dispatch(register({ username, password }));
    };

    // 컴포넌트에서 처음 렌더링 될 때 form 초기화
    useEffect(() => {
        dispatch(initializeForm('register'));
    }, [dispatch]);

    //회원가입 성공/실패처리
    useEffect(() => {
        if (authError) {
            //계정명이 이미 존재할때
            if(authError.response.status === 409) {
                setError('이미 존재하는 계정명입니다.');
                return;
            }
            console.log('회원가입 실패');
            console.log(authError);
            setError('회원가입 실패');
            return;
        }
        if (auth) {
            console.log('회원가입 성공');
            console.log(auth);
            navigate('/');
            return;
        }
    }, [authError, auth, navigate]);

    return <AuthForm type="register" form={form} onChange={onChange} onSubmit={onSubmit} error={error} />;
};

export default RegisterForm;