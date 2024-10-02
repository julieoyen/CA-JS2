import { submitEditForm } from "../../api/post/update";
import { authGuard } from "../../utilities/authGuard";
import { onUpdatePost } from "../../ui/post/update";

authGuard();



const form = document.forms.editPost;
console.log("trying to find post");
form.addEventListener("submit", submitEditForm);
