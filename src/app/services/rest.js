import axios from "axios";
import { HEADERS, TOKEN_KEY } from "app/utils/constants";

export const login = async (reqBody) => {
  const response = await axios.post("/axelor-erp/callback", { ...reqBody });
  if (response.status === 200) {
    const csrf = response.headers.get("x-csrf-token");
    localStorage.setItem(TOKEN_KEY, csrf);
  }
};

export const rest = axios.create({
  baseURL: "/axelor-erp/ws",
  headers: HEADERS,
});

export default rest;
rest.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      await login({
        username: "admin",
        password: "admin",
      });
    }
    return {
      ...config,
      headers: {
        ...config?.headers,
        "X-CSRF-Token": localStorage.getItem(TOKEN_KEY),
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const fetchData = async (model, reqBody) => {
  const response = await rest.post(`/rest/${model}/search`, reqBody);
  return response.data;
};
export const saveData = async (model, reqBody) => {
  const response = await rest.post(`/rest/${model}`, reqBody);
  return response.data.data;
};
export const fetchDataById = async (model, id, reqBody) => {
  const response = await rest.post(`/rest/${model}/${id}/fetch`, reqBody);
  return response.data.data;
};
export const deleteData = async (model, reqBody) => {
  const response = await rest.post(`/rest/${model}/removeAll`, reqBody);
  return response.data;
};
export const fetchFollowers = async (model, id) => {
  const response = await rest.get(`/rest/${model}/${id}/followers`);
  return response.data.data;
};
export const deleteFollowers = async (model, id, reqBody) => {
  const response = await rest.post(`/rest/${model}/${id}/unfollow`, reqBody);
  return response.data;
};
export const Follow = async (model, id, reqBody) => {
  const response = await rest.post(`/rest/${model}/${id}/follow`, reqBody);
  return response.data.data;
};
export const AddFollower = async (reqBody) => {
  const response = await rest.post(`/search/emails`,reqBody);
  return response.data;
};

export const postMessages = async (model, id, reqBody) => {
  const response = await rest.post(`/rest/${model}/${id}/message`, reqBody);
  return response.data;
};

export const fetchMessages = async (model, id, limit) => {
  const response = await rest.get(
    `/messages?relatedId=${id}&relatedModel=${model}&limit=${limit}&offset=0`
  );
  return response.data;
};
export const fetchComments = async (type, model, id, limit) => {
  const response = await rest.get(
    `messages?type=${type}&relatedId=${id}&relatedModel=${model}&limit=${limit}&offset=0`
  );
  return response.data;
};
export const deleteMessages = async (id) => {
  const response = await rest.delete(`/messages/${id}`);
  return response;
};

//for fetching initial data on opportunity component mount
export const fetchInitialData = async (reqBody) => {
  const response = await rest.post(`/action`, reqBody);
  return response.data.data;
};

// export const fetchRatingImg = async () => {
//   try {
//     const img1 = await axios.get(`/axelor-erp/img/rating/gold-rating-1.png`);
//     const img2 = await axios.get(`/axelor-erp/img/rating/gold-rating-2.png`);
//     const img3 = await axios.get(`/axelor-erp/img/rating/gold-rating-3.png`);
//     const img4 = await axios.get(`/axelor-erp/img/rating/gold-rating-4.png`);
//     const img5 = await axios.get(`/axelor-erp/img/rating/gold-rating-5.png`);
//     return [img1, img2, img3, img4, img5];
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     return []; // Return an empty array if there's an error
//   }
// };

// export const fetchTeamImg = async (id) =>{
//   try{
//     const image = await axios.get(`/axelor-erp/ws/rest/com.axelor.team.db.Team/${id}/image/download?image=true&v=0&parentId=${id}&parentModel=com.axelor.team.db.Team`)
//   }
//   catch(error){
//     console.log("error fetching image",error)
//   }
// }
