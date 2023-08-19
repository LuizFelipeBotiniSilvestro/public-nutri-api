import "./UserItem.css";

const UserItem = ({ user }) => {
  return (
    <div>
       <h2>{user.name}</h2>
       <input type="submit" value="Cadastrar" />
    </div>
  );
};

export default UserItem;
