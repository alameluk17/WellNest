// -- not relevant right now, will look into it later

// import { useState, useEffect } from "react";
// import axios from "axios";

// export const useTranslation = (text, inlan, outlan) => {
//   const [translatedText, setTranslatedText] = useState(text);

//   useEffect(() => {
//     const translateText = async () => {
//       try {
//         if (outlan == "en") setTranslatedText(text);
//         else {
//           const response = await axios.get(
//             `https://fb67-49-204-129-95.ngrok-free.app/translate`,
//             {
//               params: {
//                 inlan: inlan,
//                 outlan: outlan,
//                 text: text,
//               },
//             }
//           );
//           setTranslatedText(response.data.output[0].target);
//         }
//       } catch (error) {
//         console.error("Translation error:", error);
//       }
//     };

//     if (text) {
//       translateText();
//     }
//   }, [text, inlan, outlan]);

//   return translatedText;
// };
