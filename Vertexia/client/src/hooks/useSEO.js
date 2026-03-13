import { useEffect } from 'react';

const useSEO = ({ title, description }) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} | Vertexia E-Commerce`;
        }

        if (description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = description;
                document.head.appendChild(meta);
            }
        }

        // Cleanup isn't strictly necessary but good practice could restore original title
        return () => {
            document.title = "Vertexia | Premium 3D E-Commerce";
        };
    }, [title, description]);
};

export default useSEO;
