import React, { useRef, useEffect } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import { Character, CharacterLink } from '@/types';
import { v4 as uuid } from 'uuid';

interface CharacterGraphProps {
  nodes: Character[];
  links: CharacterLink[];
  onClickNode: (node: Character | null) => void;
}

const CharacterGraph: React.FC<CharacterGraphProps> = ({ nodes, links, onClickNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const visNodes = nodes.map(node => ({
        id: node.id,
        label: node.name,
        shape: 'circularImage',
        image: `${node.thumbnail.path}.${node.thumbnail.extension}`, // Assuming thumbnail data is available
      }));

      const visEdges = links.map(link => ({
        id: uuid(),
        from: link.source.toString(),
        to: link.target.toString(),
        label: link.id,
        color: link.type === 'series' ? 'blue' : 'green',
        font: { size: 0 },
      }));

      const data = {
        nodes: new DataSet(visNodes),
        edges: new DataSet(visEdges),
      };

      const options = {
        nodes: {
          borderWidth: 2,
          size: 32,
          color: {
            border: "#222222",
            background: "#666666",
          },
          font: { color: "#666666" },
        },
        edges: {
          color: '#000000',
          width: 2,
          font: {
            size: 12,
            align: 'middle',
            color: '#000000',
          },
          smooth: true,
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
        },
        physics: {
          stabilization: false,
          wind: { x: 0, y: 0 },
          enabled: true,
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 100,
            springConstant: 0.08,
          },
          solver: 'forceAtlas2Based',
        },
      };

      const network = new Network(containerRef.current, data, options);

      // show label
      network.on('hoverEdge', function (params) {
        data.edges.update({ id: params.edge, font: { size: 12 } });
      });

      // hide label
      network.on('blurEdge', function (params) {
        data.edges.update({ id: params.edge, font: { size: 0 } });
      });

      network.on('click', function (params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            onClickNode(node);
          }
        }
      });

      return () => {
        network.destroy();
      };
    }
  }, [nodes, links, onClickNode]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
};

export default CharacterGraph;
