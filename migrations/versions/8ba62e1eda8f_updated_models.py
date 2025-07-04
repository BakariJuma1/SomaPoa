"""updated models

Revision ID: 8ba62e1eda8f
Revises: 99af45db5571
Create Date: 2025-06-24 10:37:38.065674

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8ba62e1eda8f'
down_revision = '99af45db5571'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('applications', schema=None) as batch_op:
        batch_op.add_column(sa.Column('submission_date', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
        batch_op.create_unique_constraint('unique_student_programme', ['student_id', 'program_id'])

    with op.batch_alter_table('programs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('description', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('deadline', sa.Date(), nullable=False))

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password_hash', sa.String(), nullable=False))
        batch_op.drop_column('password')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.drop_column('password_hash')

    with op.batch_alter_table('programs', schema=None) as batch_op:
        batch_op.drop_column('deadline')
        batch_op.drop_column('description')

    with op.batch_alter_table('applications', schema=None) as batch_op:
        batch_op.drop_constraint('unique_student_programme', type_='unique')
        batch_op.drop_column('submission_date')

    # ### end Alembic commands ###
