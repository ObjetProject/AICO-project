window.onload = function () {
  // 해시태그 기능
  let input = document.querySelector('input[name="tags"]');
  new Tagify(input, {
    whitelist: STYLE_TAG,
    maxTags: 10,
    dropdown: {
      maxItems: 20,
      classname: "tags-look",
      enabled: 0,
      closeOnSelect: false,
    },
  });

  // 파일 표시 기능
  let file = document.querySelector("#img_file");
  let show = document.querySelector("#file_show");
  let deleteBtn = document.querySelector("#file_delete_btn");

  file.addEventListener("change", function () {
    if (window.FileReader) {
      var filename = $(this)[0].files[0].name;
    } else {
      // old IE
      var filename = $(this).val().split("/").pop().split("\\").pop(); // 파일명만 추출
    }

    // 화면 보이기, 추출한 파일명 삽입
    $(show).css("display", "block");
    $(deleteBtn).css("display", "block");
    $(this).siblings(show).val(filename);
  });
};

function textareaSize() {
  let textarea = document.querySelector("#generate_txt");
  let generateTxt = textarea.value;

  textarea.style.height = "auto";
  textarea.style.minHeight = `36px`;
  let height = textarea.scrollHeight; // 높이

  if (height > 300) {
    textarea.style.height = `300px`;
    textarea.style.overflow = `auto`;
  } else if (generateTxt.split("\n").length > 1) {
    textarea.style.height = `${height + 5}px`;
    textarea.style.minHeight = `${height + 5}px`;
  } else {
    textarea.style.height = "auto";
  }
}

function deleteFile() {
  let show = document.querySelector("#file_show");
  let deleteBtn = document.querySelector("#file_delete_btn");
  show.value = "";

  $(show).css("display", "none");
  $(deleteBtn).css("display", "none");
}

const promptInput = document.querySelector("#generate_txt");
const generatedImage = document.querySelector("#picture");
const tagInput = document.querySelector("#tag");

const generateImage = async (event) => {
  event.preventDefault();

  const prompt = promptInput.value;
  const tag = tagInput.value;
  console.log(tag);
  const combinedPrompt = prompt + tag;

  if (combinedPrompt) {
    try {
      generatedImage.src = "loadingImage.gif";

      const response = await fetch("http://localhost:8003/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      const data = await response.json();
      const image = `data:image/jpeg;base64,${data.image}`;
      generatedImage.src = image;
    } catch (error) {
      console.log(error);
      showNotification(generatedImage.src);
      generatedImage.src = "loadingImage.gif";
    }
  } else {
    showNotification("요구사항을 입력하세요.");
  }
};

const generateBtn = document.querySelector(".generate_btn");
generateBtn.addEventListener("click", generateImage);

const forms = document.getElementsByClassName(".generate_form");
for (let i = 0; i < forms.length; i++) {
  forms[i].addEventListener("submit", generateImage);
}

const STYLE_TAG = [
  // artist
  "goheu",
  "dabinchi",
  "mungkeu",
  "pikaso",
  "mikellanjello",
  "bellaseukeseu",
  "botichelli",
  "keullimteu",
  "dalli",
  "mane",
  "aendi wohol",
  "huan milo",
  "egeleu",
  "yohaneseu",

  // westTime: [
  "Middle Ages",
  "renaissance",
  "mannerism",
  "Baroque",
  "Rococo",
  "romanticism",
  "neo-classicism",
  "Realism",
  "Art Nouveau",
  "impressionism",
  "Postimpressionism",
  "fauvism",
  "expressionism",
  "Futurism",
  "Cubism",
  "surrealism",
  "abstract expressionism",
  "neoplasticism",
  "Dadaism",
  "monochrome",
  "Informalism",
  "Nouveau Realism",
  "Op Art",
  "pop art",
  "Arte Povera",
  "minimalism",
  "conceptual art",
  "modern art",
  "Kinetic Art",

  // plus
  "Pixel Art",
  "Night view",
  "Future City",
  "cyber punk",
  "steampunk",
  "emotional",
  "romantic",
  "Mystery",
  "warm",
  "cold",
  "Thriller",
  "Futuristic",
  "West",
  "Retro",
  "Fantastic",
  "fascinating",
  "Mysterious",
  "real",
  "Fear",
  "Digital Art",
  "3D",
  "oil",
  "Sculpture",
  "Oriental",
  "silhouette",
  "Neon sign",
  "Neon light",
  "sketch",
  "Oil pastel",
  "Digital Art",
  "comics",
  "cartoons",
  "Of city",
  "red",
  "yellow",
  "green",
  "Blue",
  "purple",
  "black",
  "thin",
  "gray",
  "Nature",
  "artificial",
  "Korean style",
  "Japanese style",
];
