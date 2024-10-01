import { onUpdatePost } from "../../ui/post/update";
import { authGuard } from "../../utilities/authGuard";

authGuard();

const form = document.forms.editPost;
console.log("trying to find post");
form.addEventListener("submit", onUpdatePost);
