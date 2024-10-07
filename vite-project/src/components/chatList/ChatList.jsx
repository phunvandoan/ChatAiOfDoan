import { Link } from "react-router-dom";
import "./chatList.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function ChatList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChat"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const queryClient = useQueryClient();
  const deleteChatMutation = useMutation({
    mutationFn: (chatId) =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["userChat"], (oldData) => {
        return oldData.filter((chat) => chat._id !== variables);
      });
    },
  });

  const handleDelete = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteChatMutation.mutate(chatId);
    }
  };

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore DOAN AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "...is loading "
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                    {chat.title}
                  </Link>
                  <button
                    onClick={() => handleDelete(chat._id)}
                    className="deleteChat"
                  >
                    🗑
                  </button>
                </div>
              </>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to DOAN AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
}

export default ChatList;
