import styles from "./Title.module.scss";

interface TitleProps {
  isSmall: boolean;
  titleText: string;
  descriptionText: string;
}

export default function Title({
  isSmall,
  titleText,
  descriptionText,
}: TitleProps) {
  return (
    <div className={styles.title_container}>
      <h2 className={`${styles.title} ${isSmall ? styles.small : ""}`}>
        {titleText}
      </h2>
      <p className={styles.description}>{descriptionText}</p>
    </div>
  );
}
