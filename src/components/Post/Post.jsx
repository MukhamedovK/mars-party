const Post = ({ post }) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src="/default-avatar.png" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold">{post.author || "Аноним"}</p>
            <p className="text-xs text-gray-500">🌍 Ростов-на-Дону</p>
          </div>
        </div>
        <span className="text-xl text-gray-400">⋯</span>
      </div>

      <img src={post.imageUrl} alt="Post" className="w-full" />

      <div className="flex items-center px-4 py-2 space-x-4 text-xl">
        <button>❤️</button>
        <button>💬</button>
        <button>📤</button>
      </div>

      <div className="px-4 pb-2">
        <p className="font-semibold">{post.likes || 0} лайков</p>
        <p><span className="font-semibold">{post.author || "Аноним"}</span> {post.caption}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Post;
