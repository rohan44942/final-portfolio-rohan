import { motion } from "framer-motion";

function PageSection({ title, children }) {
  return (
    <motion.section
      className="section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {title ? <h1 className="section-header">{title}</h1> : null}
      {children}
    </motion.section>
  );
}

export default PageSection;
