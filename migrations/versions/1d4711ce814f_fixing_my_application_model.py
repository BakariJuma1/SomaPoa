"""Fixing my application model

Revision ID: 1d4711ce814f
Revises: 920abd843d2e
Create Date: 2025-06-24 16:28:10.762369

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1d4711ce814f'
down_revision = '920abd843d2e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('applications', schema=None) as batch_op:
        batch_op.add_column(sa.Column('income_proof_url', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('academic_proof_url', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('education_level', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('kcpe_score', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('kcse_grade', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('gpa', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('score', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('is_eligible', sa.Boolean(), nullable=True))
        batch_op.drop_column('level_of_study')
        batch_op.drop_column('average_grade')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('applications', schema=None) as batch_op:
        batch_op.add_column(sa.Column('average_grade', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('level_of_study', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.drop_column('is_eligible')
        batch_op.drop_column('score')
        batch_op.drop_column('gpa')
        batch_op.drop_column('kcse_grade')
        batch_op.drop_column('kcpe_score')
        batch_op.drop_column('education_level')
        batch_op.drop_column('academic_proof_url')
        batch_op.drop_column('income_proof_url')

    # ### end Alembic commands ###
