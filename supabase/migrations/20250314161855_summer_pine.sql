/*
  # Add Update and Delete Policies

  1. Security Changes
    - Add policies for:
      - Updating analyses
      - Deleting analyses
*/

-- Create policies for update and delete
CREATE POLICY "Enable update access for all users"
ON analyses FOR UPDATE
USING (true);

CREATE POLICY "Enable delete access for all users"
ON analyses FOR DELETE
USING (true);