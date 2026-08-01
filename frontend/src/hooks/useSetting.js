import { useEffect, useState } from "react";
import axios from "axios";

export default function useSetting() {
  const [setting, setSetting] = useState(null);

  useEffect(() => {
    axios
      .get("/api/setting")
      .then((res) => setSetting(res.data))
      .catch((err) => console.error(err));
  }, []);

  return setting;
}