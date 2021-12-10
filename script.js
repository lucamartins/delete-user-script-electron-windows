import { getUsersInfo } from './deleteUser.js';

const fetchUsersInfo = async () => {
  try {
    const data = await getUsersInfo();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

fetchUsersInfo();
