import { Filter } from "@/components/Filter"
import styles from "./styles.module.scss"

export const Header = ({ setFilter }: { setFilter: any }) => {
	return (
		<nav className={styles.header}>
			<Filter setFilter={setFilter} />
		</nav>
	)
}
