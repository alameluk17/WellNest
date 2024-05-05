// -- not relevant right now, will look into it later

import { useState, useEffect } from "react";
import axios from "axios";

export const useTranslation = (text, outlan) => {
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    const translateText = async () => {
      try {
        if (outlan === "eng_Latn") {
          setTranslatedText(text);
        } else {
          const response = await axios.post(
            "https://fb67-49-204-129-95.ngrok-free.app/translate",
            {
              body: text,
              target_lang: outlan,
            }
          );
          console.log(response)
        //   setTranslatedText(response.data.output[0].target);
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    if (text) {
      translateText();
    }
  }, [text, outlan]);

  return translatedText;
};
