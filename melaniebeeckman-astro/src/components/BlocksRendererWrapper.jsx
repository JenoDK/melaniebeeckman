import React from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

const BlocksRendererWrapper = ({ content }) => {
    return <BlocksRenderer content={content} />;
};

export default BlocksRendererWrapper;