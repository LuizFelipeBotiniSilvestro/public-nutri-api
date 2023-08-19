import "./Auth.css";

// Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";

// Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  const [crn, setCrn] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subscription, setSubscription] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNutritionist, setIsNutritionist] = useState(false);

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
      crn,
      subscription,
      isNutritionist
    };

    dispatch(register(user));
  };

  // Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="register">
      <h2>NutriAPI</h2>
      <p className="subtitle">Cadastre-se para compartilhar conteúdo científico.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <input 
              type="checkbox" 
              checked={isNutritionist} 
              onChange={(e) => setIsNutritionist(e.target.checked)}
            />
            <label>Sou nutricionista</label>
          </div>
          {
            isNutritionist && (
                <div>
                  <input
                    type="text"
                    placeholder="Inscrição"
                    onChange={(e) => setSubscription(e.target.value)}
                    value={subscription}
                    style={{
                      marginRight: '4px',
                      width: "10vw"

                    }}
                  />
                  <select 
                    value={crn} 
                    onChange={(e) => setCrn(e.target.value)} 
                    style={{ width: "10vw" }}
                  >
                    <option value="0">Selecione</option>
                    <option value="1">CRN1</option>
                    <option value="2">CRN2</option>
                    <option value="3">CRN3</option>
                    <option value="4">CRN4</option>
                    <option value="5">CRN5</option>
                    <option value="6">CRN6</option>
                    <option value="7">CRN7</option>
                    <option value="8">CRN8</option>
                    <option value="9">CRN9</option>
                    <option value="10">CRN10</option>
                    <option value="11">CRN11</option>
                  </select>
                </div>
            )
          }
        </div>
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" disabled value="Aguarde..." />}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique aqui</Link>
      </p>
    </div>
  );
};

export default Register;
