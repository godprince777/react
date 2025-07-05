import AuthForm from "../../components/auth/AuthForm";
import { changeField, initializeForm, login } from "../../modules/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const dispatch = useDispatch();
    const form = useSelector(state => state.auth.login);
    const auth = useSelector(state => state.auth.auth);
    const authError = useSelector(state => state.auth.authError);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    // 인풋 변경 이벤트 핸들러
    const onChange = e => {
        const { value, name } = e.target;
        dispatch(changeField('login', name, value));
    };
    // 폼 등록 이벤트 핸들러
    const onSubmit = e => {
        e.preventDefault();
        const { username, password } = form;
        dispatch(login({ username, password }));
    };
    // 컴포넌트에서 처음 렌더링 될 때 form 초기화
    useEffect(() => {
        dispatch(initializeForm('login'));
    }, [dispatch]);

    // 로그인 성공/실패 처리
    useEffect(() => {
        if (authError) {
            console.log('로그인 실패');
            console.log(authError);
            setError('로그인 실패');
            return;
        }
        if (auth) {
            console.log('로그인 성공');
            console.log(auth);
            navigate('/');
            return;
        }
    }, [authError, auth, navigate]);

    return <AuthForm 
             type="login"
             form={form}
             onChange={onChange}
             onSubmit={onSubmit} 
             error={error}
            />;
};

export default LoginForm;