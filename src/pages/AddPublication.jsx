import React, { useRef, useState, useEffect } from 'react'; // Added useEffect
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AddPublication = () => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("Uzbekistan(Tashkent)");
    const [loading, setLoading] = useState(false);
    const username = useSelector(state=>state.user); // State to hold username
    const token = useSelector(state => state.user.token)
  
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.username) {
      }
    }, []);
  
    const handleFileClick = () => {
      fileInputRef.current.click();
    };
  
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
    };
  
    const sendPublication = async () => {
      if (!file) {
        toast.error("Iltimos, fayl yuklang!");
        return;
      }
  
      if (!username) {
        toast.error("Foydalanuvchi nomi topilmadi. Iltimos, tizimga kiring!");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("author", username); // Use dynamic username instead of "test"
      formData.append("description", description);
      formData.append("location", location); // Added location to formData
  
      setLoading(true);
      console.log(token)
      console.log("request: ",{
          token,
          formData
        })
      try {
        const response = await fetch("https://backend-mars-hub.onrender.com/api/v1/publications/create", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token,
          },
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("Muvaffaqiyatli yuklandi: ", result);
          toast.success("Fayl muvaffaqiyatli yuklandi!");
  
          setFile(null);
          setPreview(null);
          setDescription("");
          setLocation("Uzbekistan(Tashkent)");
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Xatolik yuz berdi!");
        }
      } catch (e) {
        console.error("Upload error:", e);
        toast.error("Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex flex-col gap-5 h-full w-full p-5 rounded-xl bg-base-300">
      <p className='flex items-center justify-center text-xl font-medium'>Добавить в публикацию</p>
      <div className='h-36 sm:h-44 md:h-52 lg:h-80 w-full space-y-2'>
        <div
          className='file-input h-36 sm:h-44 md:h-52 lg:h-80 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer'
          onClick={handleFileClick}
        >
          {preview ? (
            file.type.startsWith("image/") ? (
              <img src={preview} alt="file preview" className="w-full h-full object-cover rounded-lg" />
            ) : file.type.startsWith("video/") ? (
              <video src={preview} controls className="w-full h-full object-cover rounded-lg" />
            ) : null
          ) : (
            <>
              <img
                src=""
                alt="Upload Placeholder"
                className="w-20 h-14 xl:w-36 xl:h-28 lg:w-32 lg:h-24 md:w-28 md:h-20 sm:w-20 sm:h-14"
              />
              <p className="lg:text-md md:text-sm sm:text-xs text-xs text-primary mt-2">Faylni yuklash uchun bosing</p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
        <input
          type="text"
          placeholder="Добавьте подпись..."
          className="input input-ghost w-full rounded-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="select w-full"
        >
          <option value="Uzbekistan(Tashkent)">Uzbekistan(Tashkent)</option>
          <option value="Qo'yliq">Qo'yliq</option>
          <option value="Yunusobod">Yunusobod</option>
          <option value="Sergeli">Sergeli</option>
        </select>
        <button
          className='btn btn-primary w-full'
          onClick={sendPublication}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Поделиться"}
        </button>
      </div>
    </div>
  );
};

export default AddPublication;