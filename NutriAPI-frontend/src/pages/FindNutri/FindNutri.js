import { BsFillPersonCheckFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { updateFollowers } from "../../slices/userSlice"
import userService from "../../services/userService";

const FindNutri = () => {
  const dispatch = useDispatch();
  const { user: userState, loading } = useSelector((state) => state.auth);
  
  const [nutritionists, setNutritionists] = useState([]);
  const [user, setUser] = useState(userState);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Crn',
      dataIndex: 'crn',
      key: 'crn',
      align: 'right',
    },
    {
      title: 'Subscription',
      dataIndex: 'subscription',
      key: 'subscription',
      align: 'right',
    },
    {
      title: 'Follow',
      dataIndex: 'follow',
      key: 'follow',
      align: 'center',
      render: (text, record) => (
        <button
          onClick={() => followNutritionist(record.key)}
          disabled={record.alreadyFollowed}
        >
          <BsFillPersonCheckFill/>
        </button>
      )
    },
  ];
  
  const followNutritionist = async (nutritionistId) => {
    dispatch(updateFollowers(nutritionistId));
    
    // pegar o index do nutricionista alterado e alterar a propriedade alreadyFollowed para que o react renderize automaticamente
    const nutritionistIndex = nutritionists.findIndex((nutritionist) => nutritionist._id === nutritionistId);
    nutritionists[nutritionistIndex].alreadyFollowed = true;
    
    setNutritionists([...nutritionists]);
  }

  // Load all Nutricionists
  useEffect(() => {
    loadNutritionists();
  }, [user]);

  useEffect(() => {
    if (!loading) {
     loadUser(); 
    }
  }, [loading])

  const loadUser = async () => {
    const data = await userService.getUserDetails(userState._id);
    setUser(data);
  }

  const loadNutritionists = async () => {
    const data = await userService.getAllNutritionist();
    const formattedNutritionists = data.map(({ _id, name, crn, subscription }) => {
      return {
        key: _id,
        _id,
        name,
        crn,
        subscription,
        alreadyFollowed: user.following?.some((follower) => follower.userId === _id)
      }
    });

    setNutritionists(formattedNutritionists);
  }

  return (
    <>
      <table id="followers" border="1">
        <thead>
          <th>Nome</th>
          <th>CRN</th>
          <th>Inscrição</th>
          <th>Seguir</th>          
        </thead>
        <tbody>
          {
            nutritionists.map((nutritionist) => (
              <tr key={nutritionist._id}>
                <td>{nutritionist.name}</td>
                <td>{nutritionist.crn}</td>
                <td>{nutritionist.subscription}</td>
                <td align="center">
                  <button
                    onClick={() => followNutritionist(nutritionist.key)}
                    disabled={nutritionist.alreadyFollowed}
                  >
                    <BsFillPersonCheckFill/>
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
  
};

export default FindNutri;