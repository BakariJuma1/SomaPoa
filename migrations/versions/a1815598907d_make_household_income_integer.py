"""Make household_income integer

Revision ID: a1815598907d
Revises: 1d4711ce814f
Create Date: 2025-06-24 18:09:49.741054

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1815598907d'
down_revision = '1d4711ce814f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('applications', schema=None) as batch_op:
        batch_op.alter_column(
            'household_income',
            existing_type=sa.VARCHAR(length=255),
            type_=sa.Integer(),
            nullable=False,
            postgresql_using="household_income::integer"
        )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('applications', schema=None) as batch_op:
        batch_op.alter_column('household_income',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(length=255),
               nullable=False)

    # ### end Alembic commands ###
