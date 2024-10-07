import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";

function NewPromp({ data }) {
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello, I have 2 dogs in my house." }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {
      // maxOutputTokens: 4096,
      temperature: 0.7, // Đảm bảo câu trả lời sáng tạo nhưng mạch lạc
      top_p: 0.9, // Tạo câu trả lời tự nhiên hơn
    },
  });

  const endRef = useRef();
  const formRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, answer, question, img.dbData]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data?._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData] : [text]
      );
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        for (const char of chunkText) {
          setAnswer((prev) => prev + char);
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
      mutation.mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    setAnswer;
    add(text, false);
    inputRef.current.value = "";
  };

  console.log(answer);

  return (
    <>
      {img.isLoading && <div className="">Loadding</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width={380}
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <div className="newPrompt">
        <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
          <Upload setImg={setImg} />
          <input id="file" type="file" multiple={false} hidden />
          <input
            type="text"
            name="text"
            placeholder="Ask anything..."
            ref={inputRef}
          />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </>
  );
}

NewPromp.propTypes = {
  data: PropTypes.object,
};

export default NewPromp;
