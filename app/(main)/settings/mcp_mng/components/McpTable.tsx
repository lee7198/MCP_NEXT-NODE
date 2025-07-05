import React from 'react';
import { McpTableProps } from '@/app/types';
import {
  GRID_STYLES,
  GridHeader,
  LoadingSkeleton,
  EditableInput,
  ActionButton,
  getColSpanClass,
} from '@/app/components/common/GridStyles';

export const McpTable: React.FC<McpTableProps> = ({
  mcpTools,
  onEdit,
  onDelete,
  editedTools,
  setEditedTools,
  isPending,
}) => {
  const columns = [
    { label: 'Tool 이름', span: 2 },
    { label: '설명', span: 4 },
    { label: '작업', span: 2 },
  ];

  if (isPending) {
    return (
      <div className={GRID_STYLES.container}>
        <GridHeader columns={columns} />
        <LoadingSkeleton columns={columns} />
      </div>
    );
  }

  return (
    <div className={GRID_STYLES.container}>
      <GridHeader columns={columns} />
      <div className={GRID_STYLES.divider}>
        {mcpTools.map((tool) => {
          const isEditing = editedTools[tool.TOOLNAME];
          const currentTool = isEditing || tool;

          return (
            <div key={tool.TOOLNAME} className={GRID_STYLES.row}>
              {/* Tool 이름 */}
              <div className={getColSpanClass(columns[0].span)}>
                <span className={GRID_STYLES.cellMedium}>{tool.TOOLNAME}</span>
              </div>
              {/* 설명 */}
              <div className={getColSpanClass(columns[1].span)}>
                {isEditing ? (
                  <EditableInput
                    value={currentTool.COMMENT}
                    onChange={(value) =>
                      setEditedTools((prev) => ({
                        ...prev,
                        [tool.TOOLNAME]: {
                          ...currentTool,
                          COMMENT: value,
                        },
                      }))
                    }
                  />
                ) : (
                  <span className={GRID_STYLES.cellMuted}>
                    {currentTool.COMMENT}
                  </span>
                )}
              </div>
              {/* 작업 */}
              <div
                className={`${getColSpanClass(columns[2].span)} ${GRID_STYLES.actions}`}
              >
                <ActionButton onClick={() => onEdit(currentTool)}>
                  {isEditing ? '취소' : '수정'}
                </ActionButton>
                {isEditing && (
                  <ActionButton
                    onClick={() => onDelete(currentTool.TOOLNAME)}
                    variant="danger"
                  >
                    삭제
                  </ActionButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
