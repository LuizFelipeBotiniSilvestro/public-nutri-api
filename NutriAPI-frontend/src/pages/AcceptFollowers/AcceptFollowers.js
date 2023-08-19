import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";

import { acceptFollowers } from "../../slices/userSlice"
import userService from "../../services/userService";


export const AcceptFollowers = () => {
  const dispatch = useDispatch();
  const { user: nutritionistState, loading } = useSelector((state) => state.auth);
  
  const [followers, setFollowers] = useState([]);

  const  acceptFollower = async (userId) => {
    dispatch(acceptFollowers(userId));
    
    // pegar o index do nutricionista alterado e alterar a propriedade alreadyFollowed para que o react renderize automaticamente
    const userIndex = followers.findIndex((follower) => follower.userId === userId);
    followers[userIndex].isAccepted = true;
    
    setFollowers([...followers]);
  };

  useEffect(() => {
    if (!loading) {
      loadAllFollowersRequest()
    }
  }, [loading])

  const loadAllFollowersRequest = async () => {
    const data = await userService.getUserDetails(nutritionistState._id);
    const formattedFollowers = data.followers.map(({ userId, name, email, isAccepted }) => {
      return {
        key: userId,
        userId,
        name,
        email,
        isAccepted
      }
    });

    setFollowers(formattedFollowers);
  }
  return (
    <>
      <table id="followers" border="1">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Aceitar</th>
          </tr>
        </thead>
        <tbody>
            {
              followers.map((follower) => (
                  <tr key={follower.userId}>
                    <td>{follower.name}</td>
                    <td>{follower.email}</td>
                    <td align="center">
                      <button
                        onClick={() => acceptFollower(follower.userId)}
                        disabled={follower.isAccepted}
                        style={!follower.isAccepted ? {backgroundColor: 'green'} : {}}
                      >
                        <GiConfirmed/>
                      </button>  
                    </td>
                  </tr>
              ))
            }
        </tbody>
      </table>
    </>
  );
}

export default AcceptFollowers;