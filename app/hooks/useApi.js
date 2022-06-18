import { useState } from 'react';

export default useApi = (apiFunc) => {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullResponse, setFullResponse] = useState({});

  const request = async (...args) => {
    setLoading(true);
    const response = await apiFunc(...args);
    setLoading(false);
    if (!response.ok) return setError(true);
    // console.log("====================================");
    // console.log(response);
    // console.log("====================================");

    setError(false);
    setFullResponse(response);
    setData(response.data);
  };

  return { data, error, loading, fullResponse, request };
};
