<template>
  <div id="app">
    <main class="main">
      <form :class="['main__form', comments.length > 0 ? 'main__form--top' : 'main__form--center']" action="" @submit.prevent="getComments">
        <input type="url" name="url" id="url" placeholder="Paste the url here" class="main__form__input">
        <button type="submit" value="" class="main__form__btn"> 
          <ForwardIcon class="main__form__btn__icon"/>
        </button>
      </form>
      <ol class="main__comments">
        <li class="main__comments__item" v-for="(comment, i) in comments" :key="i">
          <a class="main__comments__item__author" :href="`youtube.com${comment.Author.Url}`">
            <img :src="comment.Author.Image" alt="" class="main__comments__item__author__img">
          </a>
          <div class="main__comments__item__content">
            <a :href="`https://youtube.com${comment.Author.Url}`" class="main__comments__item__content__username">
              {{ comment.Author.Name }}
            </a>
            <p class="main__comments__item__content__text">{{comment.Content}}</p>
          </div>
          <div class="main__comments__item__likes">
            <ThumbIcon class="main__comments__item__likes__icon"/>
            <p class="main__comments__item__likes__count">{{ comment.Likes }}</p>
          </div>
        </li>
      </ol>
    </main>
  </div>
</template>

<script>
import Hello from "./components/Hello"
import ThumbIcon from "./assets/icons/thumb_up.svg"
import ForwardIcon from "./assets/icons/forward.svg"
import commentsPH from "./assets/placeholders/comments.json"
import axios from "axios"

export default {
	name: "app",
	components: {
		Hello,
    ThumbIcon,
    ForwardIcon
	},
	data() {
		return {
      comments: commentsPH,
      precessing: false,
      apiBase: "http://localhost:8000"
		}
	},
	methods: {
		async getComments(e) {
      if(this.processing) return false
      const exec = /v=(\w*)&?/.exec(e.target.url.value)
      if(!exec) {
        return alert("Improper url \nTry something like: https://www.youtube.com/watch?v=FobDkhPpbsw")
      } else {
        this.processing = true
        const url = exec[1]
        const comments = await axios({
          url: `${this.apiBase}/reader/comments?v=${url}&wfc=50&was=2400&show=1`,
          method: "POST"
        })
        .then(res => {
          console.log(res.data)
          return res.data.comments
        })
        .catch(err => ({
          ok: false,
          error: `Comments fetch error`,
          log: err
        }))

        console.log(comments)
        this.comments = comments
        this.processing = false
      }
    }
	}
}
</script>

<style lang="scss">
@mixin resetStyle {
  appearance: none;
  -webkit-appearance: none;
}

@function strip-unit($number) {
  @if type-of($number) == 'number' and not unitless($number) {
    @return $number / ($number * 0 + 1);
  }

  @return $number;
}

@function fluid-typo(
	$min, $max, $min_vp, $max_vp
) {
	@return calc(#{$min} + (#{strip-unit($max - $min)}) * ((100vw - #{$min_vp}) / (#{strip-unit($max_vp - $min_vp)})));
}

:root {
	--main-w: 40vw;
	--main-form-h: 5vh;
  --main-form-fs: calc(var(--main-input-h) / 3.6);
  --main-comments-item-mh: 6vh;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html,
body {
	width: 100vw;
	height: 100vh;
}

body {
	overflow-x: hidden;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 8px;
		background-color: #e9e9e9;
		&-thumb {
			background-color: #6affba;
		}
	}
}

.main {
  width: var(--main-w);
  min-height: 100vh;
  overflow: hidden;
  margin: 0 auto;

  &__form {
    width: 100%;
    height: var(--main-form-h);
    font-size: var(--main-form-fs);
    display: flex;
    flex-flow: row nowrap;
    align-items: center; 
    margin-bottom: 3rem;
    transition: margin .5s 0s ease-in-out;
    
    &--top {
      margin-top: 3rem;
    }

    &--center {
      margin-top: 50vh;
      transform: translateY(-50%);
    }

    &__input {
      @include resetStyle();
      border: none;
      flex: 10 0 60%;
      height: 100%;
      background-color: #EBEBEB;
      font-size: fluid-typo(14px, 16px, 400px, 1920px);
      padding: 0 2%;
      color: #707070;

      &::placeholder {
        color: rgba(112, 112, 112, 0.59);
      }
    }

    &__btn {
      @include resetStyle();
      flex: 2 0 3rem;
      height: 100%;
      border: none;
      background-color: #6affba;
      display: flex;
      align-items: center;
      justify-content: space-around;

      &__icon {
        fill: #373737;
        height: calc(var(--main-form-h) / 2);
      }
    }
  }

  &__comments {
    display: flex;
    flex-flow: column nowrap;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    &__item {
      width: 100%;
      min-height: var(--main-comments-item-mh);
      margin-bottom: 20px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      background-color: #f8f8f8;
      overflow: hidden;

      &:nth-of-type(2n) {
        background-color: #f5f5f5;
      }

      &__author {
        display: flex;
        flex: 1 0 48px;
        align-items: center;
        justify-content: space-around;
        margin-right: 15px;
                
        &__img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 50%;
          z-index: 2;
        }
      }

      &__content {
        flex: 9 0 60%;
        padding: 1% 1% 1% 0;
        color: #373737;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: calc(-100% - 15px);
          top: 0;
          height: 100%;
          width: 100%;
          background-color: #ededed;
        }

        &__username {
          font-weight: 700;
          color: inherit;
          text-decoration: none;
          width: auto;
        }
      }

      &__likes {
        height: 100%;
        flex: .3 0 8%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-around;
        position: relative;
        padding: 0 1%;

        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          background-color: #D9D9D9;
          width: 1px;
          height: 100%;
        }

        &__icon {
          display: block;
          fill: #616161;
          transform: scale(0.8);
        }

        &__count {
          color: #4BFF37;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
