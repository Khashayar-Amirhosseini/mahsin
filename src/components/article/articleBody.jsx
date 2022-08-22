import axios from "axios";
import { useRef, useState, useEffect } from "react";
import "./article.css"
import DOMPurify from 'dompurify';

const ArticleBody = (props) => {
  const user = props.user;
  const Address = props.address
  const index = props.index
  const [isDisable, setIsDisable] = useState(false)
  const paper = props.paper
  const par3 = useRef()
  const [height3, setHeight3] = useState("inherit")

  useEffect(() => {
    if (par3.current && par3.current) {
      setHeight3(par3.current.scrollHeight)
    }
  }
    , []
  )

  const myHTML = paper.paragraphs;
  const mySafeHTML = DOMPurify.sanitize(myHTML, {
    ALLOWED_TAGS: ["h1", "h3","h5","h4", "p", "span", "img","ul","li","table","tr","td","th","a"],
    ALLOWED_ATTR: ["style", "src","href"],
  })
  var template = { __html: mySafeHTML };
  const handleChange = (e) => {
    const input = e.currentTarget;
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`
    let newPaper = { ...paper }
    newPaper[input.name] = input.value
    newPaper.changed=true
    props.onchange(e, newPaper, index)
  }

  return (
    <div className="paper-body">
      <div dangerouslySetInnerHTML={template} />
      {user.userInf.blogger?
      <textarea name="paragraphs" ref={par3} style={{ height: height3 }} defaultValue={paper.paragraphs} onBlur={handleChange} placeholder="کد html مقاله" />:
      <></>}
    </div>
  )

}

export default ArticleBody;