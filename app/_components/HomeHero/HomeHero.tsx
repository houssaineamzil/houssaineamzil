"use client"

import Image from "next/image"
import styles from "./HomeHero.module.scss"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { SplitText } from "gsap-trial/all"

gsap.registerPlugin(SplitText)

export const HomeHero = () => {
	const titleRef = useRef<any>(null)
	const descriptionRef = useRef<any>(null)
	const heroImageRef = useRef<any>(null)

	useLayoutEffect(() => {
		const timeline = gsap.timeline()
		const title = titleRef?.current
		const description = descriptionRef?.current
		const heroImage = heroImageRef?.current

		const calcWinsize = () => {
			return { width: window.innerWidth, height: window.innerHeight }
		}
		let winsize = calcWinsize()
		window.addEventListener("resize", () => (winsize = calcWinsize()))

		// TITLE ANIMATIONS
		var TitChildSplit = new SplitText(title, {
			type: "lines",
			linesClass: "split-child",
		})
		var TitParentSplit = new SplitText(title, {
			type: "lines",
			linesClass: "split-parent",
		})

		// HERO IMAGE ANIMATION
		timeline
			.set(heroImage, {
				y: -winsize.height / 2,
				scaleX: 0.2,
				scaleY: 0.6,
        duration: 1,
				// opacity: 1,
				// delay: 0.2,
			})
			.set(heroImage.children[0], {
				scale: 1.8,
			})
			.set(TitChildSplit.lines, {
				yPercent: 100,
				opacity: 0,
			})
			.set(description, {
				yPercent: 100,
				opacity: 0,
			})

		timeline
			.addLabel("startAnimation", "+=0")
			.to(
				heroImage,
				{
					duration: 1.2,
					ease: "expo",
					x: 0,
					y: 0,
					scale: 1,
					rotation: 0,
					opacity: 1,
				},
				"startAnimation"
			)
			// both the image and inner image animate the scale value to achieve the "reveal effect"
			.to(
				heroImage.children[0],
				{
					duration: 1.2,
					ease: "expo",
					scale: 1,
					objectFit: "cover",
				},
				"startAnimation"
			)
			.to(
				TitChildSplit.lines,
				{
					duration: 1.5,
					yPercent: 0,
					opacity: 1,
					ease: "power4",
					stagger: 0.1,
					delay: 0.75,
				},
				"startAnimation"
			)
			.to(
				description,
				{
					duration: 1.5,
					yPercent: 0,
					opacity: 1,
					ease: "power4",
					delay: 0.75,
				},
				"startAnimation"
			)
	}, [])

	return (
		<div className={styles.homeHero}>
			<div className={styles.locationWrapper}>
				<div className={styles.location}>
					<svg
						className={styles.locationIcon}
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M5.23914 10.393V10.3997C5.30542 12.2282 5.93837 13.9911 7.05063 15.4443L7.05702 15.4527C8.38024 17.2197 10.004 18.7402 11.8542 19.9444C11.8759 19.9585 11.8969 19.9734 11.9174 19.9891C11.9389 19.9727 11.961 19.9571 11.9837 19.9424C13.2249 19.1411 14.3693 18.1992 15.3943 17.1353C17.1959 15.2331 18.547 12.9178 18.5957 10.5206V10.4434V10.44C18.6082 6.7517 15.6284 3.75158 11.9401 3.73905C8.25233 3.72652 5.25255 6.70544 5.23914 10.393ZM3.23914 10.3878C3.25543 5.59497 7.15401 1.72278 11.9469 1.73906C16.7392 1.75535 20.611 5.653 20.5957 10.4451V10.5304L20.5955 10.5493C20.5366 13.6606 18.8119 16.4364 16.8433 18.5138L16.8377 18.5197C15.7186 19.6818 14.4704 20.7122 13.1175 21.5909C12.4148 22.1492 11.4178 22.1487 10.7156 21.5895C8.68994 20.2632 6.9111 18.5936 5.45917 16.6556C4.09275 14.8685 3.31697 12.7001 3.23973 10.4517C3.23933 10.4402 3.23914 10.4288 3.23914 10.4173V10.3878Z"
							fill="currentColor"
						/>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M11.9174 9.07837C11.1106 9.07837 10.4565 9.73242 10.4565 10.5392C10.4565 11.3461 11.1106 12.0001 11.9174 12.0001C12.7242 12.0001 13.3783 11.3461 13.3783 10.5392C13.3783 9.73242 12.7242 9.07837 11.9174 9.07837ZM8.45654 10.5392C8.45654 8.62785 10.006 7.07837 11.9174 7.07837C13.8288 7.07837 15.3783 8.62785 15.3783 10.5392C15.3783 12.4506 13.8288 14.0001 11.9174 14.0001C10.006 14.0001 8.45654 12.4506 8.45654 10.5392Z"
							fill="currentColor"
						/>
					</svg>
					<span className={styles.locationText}>Kenitra, MA</span>
				</div>
			</div>
			<div className={styles.titleWrapper}>
				<h1 className={styles.title} ref={titleRef}>
					<span className={styles.line}>
						<span>GRAPHIC</span>
						<svg
							className={styles.shapeIcon}
							viewBox="0 0 54 54"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M27.4822 4.82141L27.4861 24.5698L35.047 6.32614L27.493 24.5729L41.46 10.6113L27.4986 24.5783L45.7453 17.0244L27.5016 24.5854L47.25 24.5893L27.5016 24.5932L45.7453 32.1541L27.4986 24.6001L41.46 38.5671L27.493 24.6057L35.047 42.8525L27.4861 24.6087L27.4822 44.3571L27.4783 24.6087L19.9173 42.8525L27.4711 24.6057L13.5042 38.5671L27.4657 24.6001L9.21902 32.1541L27.4627 24.5932L7.71429 24.5893L27.4627 24.5854L9.21902 17.0244L27.4657 24.5783L13.5042 10.6113L27.4711 24.5729L19.9173 6.32614L27.4783 24.5698L27.4822 4.82141Z"
								stroke="currentColor"
								strokeWidth="3.5"
							/>
						</svg>
						<span>DESIGNER</span>
					</span>
					<span className={styles.line}>
						<span>FRONT</span>
						<svg
							className={styles.shapeIcon}
							viewBox="0 0 54 54"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M22.8497 11.3597L27.4822 24.5416L32.1148 11.3597C33.237 8.16611 30.8672 4.82141 27.4822 4.82141C24.0971 4.82141 21.7273 8.16607 22.8497 11.3597ZM22.8497 37.8188L27.4822 24.6369L32.1148 37.8188C33.237 41.0125 30.8672 44.3571 27.4822 44.3571C24.0971 44.3571 21.7273 41.0125 22.8497 37.8188ZM27.5298 24.5893L40.7117 19.9568C43.9054 18.8344 47.25 21.2042 47.25 24.5893C47.25 27.9743 43.9054 30.3442 40.7117 29.2219L27.5298 24.5893ZM14.2526 19.9567L27.4345 24.5893L14.2526 29.2219C11.059 30.3442 7.71429 27.9743 7.71429 24.5893C7.71429 21.2042 11.059 18.8344 14.2526 19.9567ZM27.5158 24.6229L40.1126 30.6684C43.1642 32.1329 43.8536 36.1737 41.4601 38.5672C39.0666 40.9611 35.0258 40.2713 33.5613 37.2197L27.5158 24.6229ZM21.4031 11.9589L27.4485 24.5556L14.8517 18.5103C11.7999 17.0457 11.1106 13.0049 13.5042 10.6113C15.8977 8.21767 19.9385 8.90703 21.4031 11.9589ZM27.4485 24.6229L21.4031 37.2197C19.9385 40.2713 15.8978 40.9607 13.5042 38.5672C11.1106 36.1737 11.7999 32.1329 14.8517 30.6684L27.4485 24.6229ZM40.1126 18.5102L27.5158 24.5556L33.5613 11.9589C35.0258 8.90703 39.0666 8.21767 41.4601 10.6113C43.8536 13.0048 43.1642 17.0457 40.1126 18.5102Z"
								fill="currentColor"
							/>
						</svg>
						<span>END</span>
						<svg
							className={styles.shapeIcon}
							viewBox="0 0 54 54"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M35.4904 26.4843C35.5105 26.4115 35.5823 26.3504 35.699 26.3163C35.9149 26.249 36.2251 26.3097 36.3789 26.4716C36.8609 26.9875 37.5886 27.4742 38.4349 27.7192C39.2824 27.9642 40.1446 27.8997 40.8938 27.4203C41.8093 26.7887 42.9459 26.3929 44.0998 26.5202C45.2448 26.6465 46.2518 27.3399 46.8166 28.6638C46.9344 28.9703 46.8166 29.4013 46.5581 29.6015C46.3003 29.8033 46.004 29.7019 45.8903 29.3968C45.7063 28.9019 45.4367 28.5092 45.1051 28.2231C44.7613 27.9339 44.3563 27.7516 43.9234 27.6705C43.4886 27.5898 43.0571 27.6146 42.6417 27.7168C42.2137 27.8169 41.8006 27.9936 41.4264 28.2331C41.1807 28.3904 40.9264 28.5116 40.6668 28.5968C40.4069 28.6824 40.1183 28.7252 39.8435 28.7401C39.2866 28.768 38.7297 28.6665 38.1853 28.4691C37.6417 28.2714 37.1485 27.9949 36.7161 27.6906C36.4971 27.5366 36.3075 27.3803 36.1104 27.2136C35.9132 27.0469 35.7319 26.8764 35.5704 26.7066C35.4973 26.63 35.472 26.552 35.4904 26.4843Z"
								fill="currentColor"
							/>
							<path
								d="M34.3675 29.0928C34.4056 29.0269 34.4877 28.9896 34.6048 28.9948C34.8308 29.0048 35.098 29.1659 35.1905 29.3744C35.5106 30.0543 35.9771 30.729 36.6975 31.255C37.0544 31.5135 37.4418 31.7057 37.8532 31.8082C38.2714 31.9165 38.6866 31.9172 39.1031 31.8102C39.6475 31.6705 40.2407 31.6225 40.7973 31.6511C41.3527 31.6801 41.911 31.8082 42.4283 32.067C42.9457 32.3262 43.384 32.7006 43.7088 33.199C44.0327 33.6953 44.2029 34.2941 44.2355 35.0068C44.2469 35.338 44.0151 35.7191 43.688 35.8071C43.3705 35.9037 43.1276 35.707 43.1318 35.3871C43.1241 34.33 42.6196 33.5275 41.8666 33.0858C41.0997 32.6354 40.205 32.5761 39.3408 32.7676C38.1685 33.0075 37.1095 32.6406 36.2148 31.8848C35.3457 31.1497 34.7161 30.1695 34.3671 29.3312C34.33 29.237 34.3359 29.1563 34.3675 29.0928Z"
								fill="currentColor"
							/>
							<path
								d="M32.3917 31.1646C32.4527 31.1187 32.5459 31.1153 32.6565 31.1622C32.8696 31.2533 33.0654 31.4952 33.0768 31.7171C33.1198 32.4329 33.3665 33.2781 33.8572 34.007C34.3482 34.7376 35.0468 35.2332 35.9225 35.3347C36.504 35.4147 37.0376 35.5235 37.5605 35.7498C38.0778 35.9718 38.5616 36.2848 38.9594 36.7041C39.3565 37.1234 39.6379 37.6211 39.7675 38.1933C39.893 38.7593 39.8895 39.4271 39.6552 40.0807C39.5506 40.3934 39.1875 40.6526 38.8631 40.6433C38.5381 40.6357 38.3766 40.3682 38.4833 40.059C38.8312 39.0533 38.6524 38.1574 38.0914 37.4803C37.529 36.8028 36.6862 36.4139 35.8137 36.31C35.5292 36.2803 35.2558 36.2092 34.9914 36.0932C34.7308 35.9825 34.4892 35.843 34.2685 35.6777C33.8263 35.3478 33.4659 34.916 33.1759 34.4167C32.8865 33.9176 32.6852 33.3879 32.5484 32.8733C32.4798 32.6158 32.4278 32.3625 32.3914 32.1185C32.3585 31.879 32.3304 31.6336 32.3124 31.3924C32.3051 31.2854 32.3349 31.2067 32.3917 31.1646Z"
								fill="currentColor"
							/>
							<path
								d="M29.8477 32.4504C29.9233 32.4383 30.0089 32.4576 30.0941 32.5336C30.2584 32.6819 30.3596 32.9767 30.2982 33.1996C30.0976 33.8954 30.0279 34.7351 30.2397 35.5954C30.4466 36.4417 30.9421 37.1851 31.7263 37.5695C32.7319 38.043 33.6543 38.8534 34.1121 39.8942C34.5816 40.9638 34.4711 42.1517 33.5989 43.3023C33.4 43.5842 32.9589 43.6722 32.6563 43.5515C32.3511 43.4258 32.2914 43.1201 32.5011 42.8733C32.8421 42.4764 33.0503 42.0505 33.1276 41.6001C33.2073 41.1584 33.1657 40.7225 33.0198 40.3073C32.8736 39.8928 32.6348 39.5284 32.3386 39.2216C32.0447 38.9234 31.684 38.6518 31.2865 38.4399C30.7643 38.1628 30.3568 37.7956 30.0567 37.3341C29.7535 36.8634 29.5632 36.3295 29.4638 35.7615C29.364 35.1934 29.3588 34.6322 29.4094 34.1115C29.4589 33.5817 29.556 33.0616 29.6925 32.624C29.7233 32.5246 29.7791 32.4659 29.8477 32.4504Z"
								fill="currentColor"
							/>
							<path
								d="M26.9999 32.767C27.0769 32.7704 27.1507 32.8267 27.2054 32.933C27.3104 33.138 27.3042 33.4486 27.1691 33.6273C26.7379 34.2051 26.3803 35.0168 26.2868 35.883C26.1915 36.7634 26.4077 37.5841 27.0131 38.2202C27.2103 38.4245 27.3929 38.6602 27.5586 38.8825C27.7238 39.104 27.8721 39.3411 27.9986 39.5903C28.2516 40.0897 28.4193 40.6374 28.4529 41.2134C28.4862 41.7887 28.3798 42.3516 28.1102 42.8755C27.9754 43.1371 27.8004 43.389 27.5835 43.6268C27.3666 43.8636 27.1077 44.0578 26.808 44.2452C26.5266 44.4188 26.082 44.3871 25.8401 44.1731C25.5968 43.9602 25.6454 43.652 25.9261 43.4818C26.8402 42.9307 27.281 42.1283 27.2886 41.2503C27.2955 40.3713 26.9015 39.5358 26.3 38.9014C26.2009 38.7969 26.1101 38.6909 26.0283 38.5774C25.9468 38.4566 25.8741 38.3334 25.81 38.2071C25.6818 37.9558 25.5868 37.6942 25.5241 37.4268C25.3983 36.8908 25.4007 36.3293 25.5009 35.7612C25.6013 35.1935 25.7888 34.6586 26.0158 34.1768C26.1295 33.9355 26.2532 33.7081 26.3828 33.4976C26.4476 33.3923 26.5138 33.2912 26.581 33.1953C26.6496 33.0917 26.72 32.9885 26.7906 32.8926C26.8547 32.8053 26.9285 32.7639 26.9999 32.767Z"
								fill="currentColor"
							/>
							<path
								d="M24.2204 32.1272C24.2859 32.1676 24.3424 32.2284 24.3569 32.3457C24.3867 32.5652 24.2741 32.8554 24.0835 32.9862C23.928 33.0967 23.7772 33.2116 23.6337 33.3303C23.4882 33.4532 23.3454 33.5902 23.2085 33.7403C22.9348 34.0406 22.6846 34.3912 22.4905 34.7857C22.2969 35.1808 22.1749 35.5926 22.1458 36.0109C22.1312 36.22 22.1399 36.4305 22.1728 36.641C22.2043 36.8554 22.265 37.059 22.3564 37.2478C22.819 38.2614 23.0048 39.4644 22.6832 40.5557C22.3526 41.6746 21.4988 42.5215 20.0902 42.838C19.7565 42.9243 19.3586 42.7189 19.2072 42.428C19.0544 42.1363 19.2065 41.864 19.526 41.8095C19.7849 41.7654 20.0226 41.6956 20.2381 41.6031C20.4571 41.5024 20.655 41.3754 20.8276 41.2328C21.1741 40.946 21.4236 40.5854 21.5795 40.1744C21.7351 39.763 21.7878 39.3306 21.759 38.9053C21.7448 38.6921 21.7091 38.4833 21.6568 38.2741C21.6079 38.057 21.5411 37.8431 21.4565 37.6353C21.2358 37.089 21.1623 36.5434 21.2282 36.0012C21.2996 35.4466 21.4981 34.9158 21.7885 34.4168C22.0785 33.918 22.4368 33.4846 22.8118 33.1177C23.1937 32.7405 23.6018 32.4078 23.9893 32.16C24.0773 32.1038 24.158 32.0948 24.2204 32.1272Z"
								fill="currentColor"
							/>
							<path
								d="M21.8361 30.5516C21.8933 30.602 21.9144 30.691 21.8881 30.8066C21.8375 31.0292 21.6317 31.2629 21.4116 31.3153C21.0568 31.4002 20.6815 31.5438 20.3138 31.7391C19.9562 31.9251 19.6038 32.1664 19.2864 32.4718C18.969 32.7766 18.7101 33.1258 18.5365 33.512C18.3726 33.8878 18.297 34.2982 18.3255 34.7313C18.3438 35.015 18.34 35.3025 18.3147 35.5889C18.2929 35.8709 18.2582 36.1414 18.1934 36.4148C18.0659 36.9577 17.841 37.485 17.4952 37.9471C17.149 38.4092 16.7041 38.773 16.1583 39.0018C15.887 39.115 15.5851 39.2009 15.2701 39.2379C14.9593 39.27 14.627 39.2623 14.2767 39.2127C13.9468 39.1668 13.6241 38.8592 13.5757 38.5421C13.533 38.217 13.7666 38.0148 14.0885 38.0679C15.1502 38.227 16.0093 37.8926 16.5821 37.2255C17.1549 36.5567 17.3898 35.6672 17.3341 34.8017C17.3001 33.6111 17.8621 32.6199 18.75 31.8851C19.6409 31.1472 20.7027 30.7141 21.5922 30.5171C21.6985 30.4902 21.7827 30.5046 21.8361 30.5516Z"
								fill="currentColor"
							/>
							<path
								d="M20.1249 28.2646C20.1568 28.3333 20.1419 28.4261 20.0743 28.5269C19.9496 28.7181 19.673 28.8699 19.4533 28.843C18.7495 28.7567 17.877 28.8496 17.0706 29.204C16.2632 29.5588 15.645 30.1596 15.3824 31.0062C15.0847 32.0782 14.4713 33.1073 13.5042 33.7482C12.546 34.3839 11.3252 34.4985 10.0417 33.8445C9.75374 33.6854 9.56488 33.2806 9.63384 32.962C9.70072 32.6425 9.99284 32.5306 10.2773 32.6911C10.7382 32.9517 11.1987 33.08 11.6378 33.0866C12.0841 33.0897 12.5145 32.9693 12.8978 32.7546C13.2838 32.5379 13.5956 32.2438 13.8521 31.8977C14.1147 31.5474 14.3164 31.1477 14.4478 30.725C14.534 30.4475 14.6505 30.1921 14.7936 29.9609C14.9461 29.7251 15.1329 29.5105 15.3352 29.3224C15.7428 28.9448 16.2348 28.666 16.7792 28.4693C17.3232 28.2719 17.8797 28.168 18.4082 28.1245C18.6736 28.102 18.9263 28.0976 19.1768 28.1028C19.436 28.1045 19.6851 28.1186 19.9191 28.1452C20.0248 28.1573 20.0951 28.2008 20.1249 28.2646Z"
								fill="currentColor"
							/>
							<path
								d="M19.3032 25.5486C19.3167 25.6235 19.2776 25.7042 19.1843 25.7753C19.0048 25.9116 18.6961 25.9592 18.4909 25.8595C17.8072 25.5437 17.0109 25.3239 16.1221 25.3825C15.2509 25.4388 14.4078 25.7981 13.9213 26.4966C13.5935 26.9525 13.1721 27.3684 12.7237 27.7035C12.2798 28.0369 11.7701 28.2961 11.2063 28.4286C10.6432 28.5611 10.0652 28.5553 9.49444 28.3813C8.9296 28.2077 8.41016 27.8581 7.92641 27.3328C7.70741 27.0857 7.63082 26.6447 7.8273 26.3693C8.00923 26.0928 8.32214 26.0876 8.52451 26.3351C9.21722 27.1389 10.1175 27.4322 10.9807 27.2883C11.8577 27.1427 12.5855 26.615 13.1195 25.9158C13.8669 24.9819 14.9217 24.5836 16.0791 24.5891C17.2348 24.5953 18.343 24.9432 19.1473 25.3653C19.2339 25.4146 19.2883 25.4796 19.3032 25.5486Z"
								fill="currentColor"
							/>
							<path
								d="M19.4739 22.6942C19.4538 22.7674 19.3824 22.8281 19.2653 22.8623C19.0494 22.9296 18.7393 22.8689 18.5854 22.7066C18.1034 22.1914 17.3757 21.7048 16.5295 21.4597C15.6819 21.2147 14.8201 21.2789 14.0705 21.7586C13.155 22.3898 12.0184 22.7857 10.8645 22.6583C9.71957 22.532 8.71256 21.8387 8.14773 20.5148C8.02991 20.2087 8.14772 19.7776 8.40623 19.5771C8.66405 19.3756 8.96033 19.4767 9.07399 19.7818C9.25834 20.2764 9.52759 20.6698 9.85922 20.9559C10.203 21.2447 10.6081 21.4273 11.0409 21.5081C11.4758 21.5892 11.9072 21.5643 12.3226 21.4618C12.7506 21.3617 13.1637 21.185 13.5379 20.9455C13.7836 20.7881 14.0379 20.6673 14.2975 20.5817C14.5574 20.4965 14.846 20.4537 15.1208 20.4389C15.6777 20.4106 16.2349 20.512 16.779 20.7098C17.3227 20.9072 17.8161 21.1836 18.2483 21.4884C18.4672 21.6416 18.6568 21.7983 18.854 21.965C19.0512 22.132 19.2324 22.3022 19.3939 22.472C19.467 22.5486 19.4923 22.6266 19.4739 22.6942Z"
								fill="currentColor"
							/>
							<path
								d="M20.5971 20.0857C20.5593 20.1517 20.4768 20.1889 20.3597 20.1837C20.1338 20.1737 19.8666 20.0125 19.7741 19.8045C19.4542 19.1239 18.9874 18.4495 18.267 17.9239C17.9101 17.6651 17.5227 17.4732 17.1114 17.37C16.6931 17.262 16.278 17.2613 15.8614 17.3682C15.3174 17.508 14.7238 17.556 14.1673 17.5273C13.6118 17.4984 13.0536 17.3703 12.5362 17.1115C12.0188 16.8523 11.5805 16.4778 11.2558 15.9798C10.9318 15.4832 10.7616 14.8844 10.7291 14.1721C10.7176 13.8405 10.9495 13.4591 11.2766 13.3718C11.594 13.2751 11.8369 13.4715 11.8327 13.7914C11.8404 14.8486 12.3449 15.651 13.0979 16.0927C13.8648 16.5431 14.7595 16.6025 15.6237 16.4109C16.7961 16.1714 17.855 16.5382 18.7497 17.2937C19.6188 18.0288 20.2485 19.0089 20.5974 19.8473C20.6345 19.9415 20.6286 20.0222 20.5971 20.0857Z"
								fill="currentColor"
							/>
							<path
								d="M22.5724 18.0142C22.5115 18.0598 22.4182 18.0632 22.3077 18.0163C22.0946 17.9252 21.8988 17.6833 21.8873 17.4613C21.8444 16.7456 21.5976 15.9004 21.1073 15.1712C20.616 14.4412 19.9174 13.9453 19.0417 13.8438C18.4602 13.7638 17.9266 13.655 17.404 13.4286C16.8863 13.2068 16.4026 12.8937 16.0047 12.4744C15.6076 12.0551 15.3262 11.5574 15.1966 10.9852C15.0712 10.4192 15.0747 9.75141 15.3089 9.09776C15.4136 8.78508 15.7767 8.52556 16.1011 8.53522C16.4261 8.54281 16.5876 8.81062 16.4809 9.11985C16.1329 10.1255 16.3118 11.0211 16.8728 11.6982C17.4352 12.3757 18.2779 12.7646 19.1505 12.8685C19.435 12.8979 19.7084 12.9693 19.9728 13.0853C20.2337 13.196 20.4749 13.3358 20.6957 13.5008C21.1378 13.8307 21.4982 14.2625 21.7882 14.7618C22.0776 15.2612 22.2789 15.791 22.4158 16.3052C22.4844 16.5627 22.5364 16.816 22.5728 17.0603C22.6057 17.2992 22.6338 17.5449 22.6521 17.7861C22.6591 17.8934 22.6293 17.9718 22.5724 18.0142Z"
								fill="currentColor"
							/>
							<path
								d="M25.1165 16.7288C25.041 16.7405 24.9557 16.7212 24.8701 16.6452C24.7059 16.4969 24.6047 16.2021 24.666 15.9792C24.8667 15.2834 24.9363 14.4438 24.7246 13.5833C24.5177 12.7371 24.0222 11.9941 23.238 11.6093C22.2324 11.1358 21.3099 10.3254 20.8522 9.28459C20.3826 8.2154 20.4935 7.02716 21.3654 5.87653C21.5643 5.59491 22.0054 5.50622 22.3079 5.6277C22.6132 5.75264 22.6728 6.0591 22.4632 6.30551C22.1222 6.70274 21.9139 7.12828 21.837 7.57831C21.7569 8.02041 21.7985 8.45664 21.9444 8.87112C22.0906 9.28632 22.3294 9.65039 22.6257 9.95756C22.9199 10.2557 23.2803 10.5266 23.6777 10.7392C24.2 11.0164 24.6075 11.3833 24.9076 11.8446C25.2108 12.3154 25.401 12.8493 25.5005 13.4174C25.6003 13.9854 25.6054 14.5466 25.5549 15.0674C25.5053 15.5971 25.4083 16.1172 25.2718 16.5548C25.2409 16.6546 25.1851 16.7132 25.1165 16.7288Z"
								fill="currentColor"
							/>
							<path
								d="M27.9643 16.4116C27.8874 16.4081 27.8136 16.3519 27.7588 16.2456C27.6538 16.0406 27.6601 15.73 27.7952 15.5512C28.2263 14.9738 28.5839 14.1617 28.6774 13.2955C28.7728 12.4151 28.5565 11.5948 27.9515 10.9584C27.754 10.7541 27.5713 10.5183 27.4057 10.2958C27.2404 10.0745 27.0924 9.83741 26.9656 9.58826C26.7126 9.08921 26.5449 8.54082 26.5113 7.96516C26.4781 7.38985 26.5844 6.82695 26.8541 6.30341C26.9888 6.04147 27.1642 5.78954 27.3811 5.55175C27.5977 5.315 27.8565 5.12069 28.1563 4.93329C28.4377 4.75935 28.8826 4.7918 29.1241 5.00577C29.3674 5.21836 29.3189 5.5269 29.0382 5.6967C28.1241 6.24785 27.6833 7.05059 27.6757 7.92857C27.6687 8.80724 28.0627 9.64278 28.6643 10.2771C28.7634 10.3817 28.8542 10.488 28.9359 10.6015C29.0174 10.722 29.0902 10.8455 29.1543 10.9711C29.2825 11.2231 29.3774 11.4843 29.4401 11.7521C29.566 12.2878 29.5635 12.8493 29.4634 13.4173C29.3629 13.9851 29.1754 14.52 28.9484 15.0021C28.8348 15.2427 28.7111 15.4704 28.5815 15.681C28.517 15.7862 28.4505 15.8873 28.3833 15.9836C28.3146 16.0868 28.2443 16.19 28.1736 16.2859C28.1095 16.3733 28.0357 16.4147 27.9643 16.4116Z"
								fill="currentColor"
							/>
							<path
								d="M30.7442 17.0514C30.6787 17.0107 30.6226 16.9503 30.608 16.833C30.5779 16.6138 30.6905 16.3232 30.8811 16.1924C31.0366 16.082 31.1874 15.967 31.3308 15.8484C31.4764 15.7255 31.6191 15.5885 31.756 15.4383C32.0298 15.1384 32.28 14.7878 32.474 14.393C32.6677 13.9982 32.7897 13.5864 32.8188 13.1678C32.8334 12.9587 32.8251 12.7482 32.7918 12.5376C32.7602 12.323 32.6996 12.1197 32.6085 11.9309C32.1459 10.9173 31.9598 9.71422 32.2814 8.62295C32.612 7.50408 33.4658 6.65681 34.8744 6.34068C35.2081 6.25406 35.6059 6.45975 35.7574 6.75068C35.9102 7.04231 35.7581 7.3146 35.4386 7.36913C35.1797 7.41331 34.942 7.48302 34.7264 7.57586C34.5074 7.67629 34.3096 7.80329 34.137 7.94582C33.7905 8.23262 33.541 8.59326 33.385 9.0043C33.2295 9.41566 33.1768 9.8481 33.2056 10.2733C33.2198 10.4866 33.2554 10.6954 33.3077 10.9045C33.3566 11.1216 33.4238 11.3356 33.5081 11.5433C33.7288 12.0896 33.8022 12.6353 33.7364 13.1775C33.665 13.7321 33.4665 14.2629 33.1761 14.7619C32.8861 15.261 32.5278 15.6941 32.1528 16.0609C31.7709 16.4385 31.3627 16.7712 30.9753 17.0186C30.8873 17.0749 30.8066 17.0839 30.7442 17.0514Z"
								fill="currentColor"
							/>
							<path
								d="M33.1286 18.6274C33.0715 18.5767 33.0503 18.4877 33.0767 18.372C33.1276 18.1498 33.3331 17.9158 33.5531 17.8637C33.908 17.7788 34.2833 17.6349 34.6509 17.4395C35.0085 17.2535 35.361 17.0123 35.6784 16.7072C35.9958 16.4021 36.2547 16.0532 36.4283 15.6667C36.5922 15.2909 36.6677 14.8805 36.6393 14.4474C36.6209 14.1637 36.6247 13.8762 36.65 13.5898C36.6719 13.3078 36.7065 13.0372 36.7713 12.7639C36.8988 12.221 37.1237 11.694 37.4696 11.2312C37.8157 10.7691 38.2607 10.4057 38.8065 10.1769C39.0778 10.0637 39.38 9.97777 39.6946 9.94082C40.0055 9.90871 40.3377 9.91633 40.6881 9.966C41.018 10.0119 41.3406 10.3194 41.3891 10.6366C41.4318 10.9617 41.1982 11.1643 40.8763 11.1108C39.8145 10.9517 38.9555 11.2861 38.3827 11.9535C37.8099 12.6221 37.5749 13.5114 37.6307 14.377C37.6647 15.568 37.1026 16.5588 36.2148 17.2936C35.3239 18.0314 34.2621 18.4649 33.3726 18.6616C33.2662 18.6885 33.182 18.674 33.1286 18.6274Z"
								fill="currentColor"
							/>
							<path
								d="M34.8395 20.9138C34.8077 20.8451 34.8226 20.7526 34.8901 20.6519C35.0149 20.4603 35.2914 20.3085 35.5111 20.3357C36.2149 20.422 37.0875 20.3288 37.8938 19.9744C38.7012 19.6196 39.3194 19.0187 39.5821 18.1722C39.8797 17.1006 40.4931 16.0711 41.4602 15.4299C42.4184 14.7945 43.6392 14.68 44.9228 15.3343C45.2107 15.493 45.3995 15.8979 45.3306 16.2164C45.2637 16.5356 44.9716 16.6478 44.6871 16.4873C44.2262 16.2268 43.7657 16.0984 43.3266 16.0918C42.8803 16.0887 42.4499 16.2095 42.0667 16.4242C41.6806 16.6409 41.3688 16.9346 41.1127 17.2807C40.8497 17.6314 40.648 18.0307 40.5167 18.4535C40.4304 18.7309 40.3139 18.9863 40.1708 19.2179C40.0183 19.4533 39.8316 19.6679 39.6292 19.856C39.2217 20.2336 38.7296 20.5125 38.1852 20.7095C37.6412 20.9066 37.0847 21.0104 36.5565 21.0543C36.2908 21.0763 36.0382 21.0808 35.7876 21.0756C35.5284 21.0739 35.2793 21.0598 35.0454 21.0332C34.9397 21.0211 34.8697 20.9776 34.8395 20.9138Z"
								fill="currentColor"
							/>
							<path
								d="M35.661 23.6303C35.6475 23.5554 35.6866 23.4743 35.7799 23.4032C35.9593 23.2665 36.2681 23.2192 36.4733 23.3193C37.1569 23.6348 37.9533 23.8546 38.8421 23.7959C39.7133 23.7397 40.5564 23.3801 41.0429 22.6819C41.3707 22.226 41.7921 21.8101 42.2405 21.475C42.6844 21.142 43.1941 20.8825 43.7579 20.7496C44.321 20.6174 44.899 20.6236 45.4697 20.7972C46.0349 20.9712 46.554 21.3204 47.0378 21.846C47.2568 22.0928 47.3334 22.5339 47.1369 22.8093C46.9549 23.0857 46.6421 23.0909 46.44 22.8434C45.747 22.0396 44.8467 21.7467 43.9835 21.8902C43.1064 22.0359 42.3787 22.5635 41.8447 23.2631C41.0976 24.1966 40.0425 24.5949 38.885 24.589C37.7294 24.5832 36.6216 24.2353 35.8169 23.8132C35.7306 23.7638 35.6759 23.699 35.661 23.6303Z"
								fill="currentColor"
							/>
						</svg>
						<span>DEVELOPER</span>
					</span>
					<span className={styles.line}>
						<span>GAME</span>
						<svg
							className={styles.shapeIcon}
							viewBox="0 0 54 54"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M43.2964 24.5893C43.2964 25.1351 43.2688 25.6746 43.2148 26.2062C43.2687 25.675 43.2964 25.136 43.2964 24.5906V24.5893Z"
								fill="currentColor"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M27.4822 44.3571C38.3996 44.3571 47.25 35.5068 47.25 24.5893C47.25 13.6718 38.3996 4.82141 27.4822 4.82141C16.5647 4.82141 7.71429 13.6718 7.71429 24.5893C7.71429 35.5068 16.5647 44.3571 27.4822 44.3571ZM27.4822 40.4036C19.294 40.4036 12.5594 34.1806 11.7495 26.2062C11.6956 25.675 11.6679 25.136 11.6679 24.5906H43.2964C43.2964 25.136 43.2687 25.675 43.2148 26.2062C42.4049 34.1806 35.6703 40.4036 27.4822 40.4036Z"
								fill="currentColor"
							/>
						</svg>
						<span>DESIGNER</span>
					</span>
				</h1>
			</div>
			<div className={styles.descriptionWrapper}>
				<p className={styles.description} ref={descriptionRef}>
					<span className={styles.indentation}>
						I&#39;m a creative designer and developer with a keen eye for
						aesthetics and a love for turning ideas into digital art. This
						perspective helps me see the world as a canvas for innovation and
						design.
					</span>
				</p>
			</div>
			<div className={styles.heroImageWrapper}>
				<div className={styles.heroImage} ref={heroImageRef}>
					<Image
						fill
						alt=""
						loading="lazy"
						className={styles.image}
						src="/assets/images/heroImage.jpeg"
					/>
				</div>
			</div>
		</div>
	)
}
